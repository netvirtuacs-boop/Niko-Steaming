import { useEffect, useState } from 'react';
import {
  X,
  Send,
  Mail,
  CheckCircle2,
  Zap,
  Loader2,
  Copy,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SiteConfig } from '../types/site';
import { SelectedOrder } from './PricingSection';
import { buildWhatsAppUrl, formatBRL, formatWhatsAppDisplay } from '../utils/formatters';
import { GeneratedTestResult, generateQuickTestFromApi, normalizeBrPhone } from '../utils/quickTestApi';
import { buildPixCopyPastePayload, NIKO_PIX_KEY } from '../utils/pixGenerator';

interface OrderModalProps {
  order: SelectedOrder | null;
  config: SiteConfig;
  onClose: () => void;
  onOpenQuickTest?: (prefill?: { phone?: string; name?: string }) => void;
}

export function OrderModal({ order, config, onClose, onOpenQuickTest }: OrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [customerDevice, setCustomerDevice] = useState('Smart TV (Samsung / LG)');
  const [loadingTest, setLoadingTest] = useState(false);
  const [error, setError] = useState('');
  const [apiWarning, setApiWarning] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<GeneratedTestResult | null>(null);
  const [copiedList, setCopiedList] = useState(false);
  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [copiedPixCode, setCopiedPixCode] = useState(false);

  useEffect(() => {
    setConfirmed(false);
    setGeneratedTest(null);
    setError('');
    setApiWarning('');
    setCopiedList(false);
    setCopiedPixKey(false);
    setCopiedPixCode(false);
  }, [order?.title, order?.price]);

  useEffect(() => {
    if (!order) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, onClose]);

  if (!order) return null;

  const isResellerPlan = order.type === 'reseller';
  const rawPhoneDigits = customerWhatsApp.replace(/\D/g, '');
  const normalizedCustomerPhone = normalizeBrPhone(rawPhoneDigits);
  const displayCustomerPhone = normalizedCustomerPhone
    ? formatWhatsAppDisplay(normalizedCustomerPhone)
    : '';

  const pixPayload = isResellerPlan
    ? buildPixCopyPastePayload({
        pixKey: NIKO_PIX_KEY,
        merchantName: config.brandName,
        amount: order.price,
        description: order.title,
      })
    : '';

  const buildOrderMessage = (testData: GeneratedTestResult | null) => {
    const cleanName = customerName.trim() || 'Cliente';
    const deliveryPhone = displayCustomerPhone || customerWhatsApp.trim() || 'Não informado';

    if (isResellerPlan) {
      return `Olá! Quero ativar o ${order.title} (${formatBRL(order.price)}) na ${config.brandName}.\nMeu nome: ${cleanName}\nWhatsApp para envio: ${deliveryPhone}\nDetalhes: ${order.subtitle}\nChave PIX: ${NIKO_PIX_KEY}\n\nPIX Copia e Cola:\n${pixPayload}`;
    }

    const baseHeader = `Olá! Quero assinar o ${order.title} (${formatBRL(order.price)}) na ${config.brandName}.\nMeu nome: ${cleanName}\nWhatsApp para envio: ${deliveryPhone}\nAparelho: ${customerDevice}\nConfiguração: ${order.subtitle}`;

    if (testData?.reply) {
      return `${baseHeader}\n\n--- LISTA DO TESTE GERADO ---\n${testData.reply}`;
    }
    return `${baseHeader}\nSolicito também o envio do Teste Rápido no WhatsApp.`;
  };

  const buildCustomerMessage = (testData: GeneratedTestResult | null) => {
    const cleanName = customerName.trim() || 'Cliente';
    if (isResellerPlan) {
      return `Olá ${cleanName}! Segue os dados PIX para ativar o ${order.title} (${formatBRL(order.price)}) na ${config.brandName}:\n\nChave PIX: ${NIKO_PIX_KEY}\n\nPIX Copia e Cola:\n${pixPayload}`;
    }
    if (testData?.reply) {
      return `Olá ${cleanName}! Segue a lista do seu Teste Rápido (${order.title} - ${config.brandName}):\n\n${testData.reply}`;
    }
    return `Olá ${cleanName}! Solicitação de Teste Rápido registrada para ${order.title} (${config.brandName}).`;
  };

  const ownerWhatsAppUrl = buildWhatsAppUrl(
    config.whatsappNumber,
    buildOrderMessage(generatedTest)
  );
  const customerWhatsAppUrl = normalizedCustomerPhone
    ? `https://wa.me/${normalizedCustomerPhone}?text=${encodeURIComponent(
        buildCustomerMessage(generatedTest)
      )}`
    : ownerWhatsAppUrl;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim().length < 2) {
      setError('Digite seu nome para continuar.');
      return;
    }
    if (rawPhoneDigits.length < 10) {
      setError('Informe um número de WhatsApp válido com DDD para envio (ex.: 11 99999-9999).');
      return;
    }

    setError('');
    setApiWarning('');

    if (isResellerPlan) {
      setConfirmed(true);
      return;
    }

    setLoadingTest(true);

    try {
      const { result } = await generateQuickTestFromApi(
        config.quickTestUrl,
        rawPhoneDigits,
        customerName
      );
      setGeneratedTest(result);
      setConfirmed(true);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Não foi possível gerar o teste automaticamente agora.';
      setGeneratedTest(null);
      setApiWarning(`${msg} Você ainda pode enviar o pedido com o link do teste no WhatsApp.`);
      setConfirmed(true);
    } finally {
      setLoadingTest(false);
    }
  };

  const handleCopyGeneratedList = async () => {
    const textToCopy = generatedTest?.reply || buildCustomerMessage(null);
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2500);
    } catch {
      setCopiedList(false);
    }
  };

  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(NIKO_PIX_KEY);
      setCopiedPixKey(true);
      setTimeout(() => setCopiedPixKey(false), 2500);
    } catch {
      setCopiedPixKey(false);
    }
  };

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopiedPixCode(true);
      setTimeout(() => setCopiedPixCode(false), 2500);
    } catch {
      setCopiedPixCode(false);
    }
  };

  const mailtoUrl = `mailto:${config.email}?subject=${encodeURIComponent(
    `Pedido ${order.title} - ${config.brandName}`
  )}&body=${encodeURIComponent(buildOrderMessage(generatedTest))}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-4"
    >
      <div className="card-luminous flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/15 px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="text-xs font-semibold text-[#FCA5A5]">Resumo da Contratação</p>
            <h3 id="order-modal-title" className="mt-1 font-display text-2xl font-bold text-white">
              {order.title}
            </h3>
            <p className="mt-1 text-sm text-slate-300">{order.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
            <span>Fechar</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center justify-between rounded-xl border border-white/15 bg-black/45 px-4 py-3.5">
            <span className="text-sm text-slate-200">Valor selecionado</span>
            <span className="font-mono text-2xl font-bold tabular-nums text-white">
              {formatBRL(order.price)}
            </span>
          </div>

          <form onSubmit={handleSubmitOrder} className="mt-5 space-y-4" noValidate>
            <div>
              <label htmlFor="order-name" className="block text-xs font-medium text-slate-200">
                Seu nome completo *
              </label>
              <input
                id="order-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (confirmed) setConfirmed(false);
                }}
                placeholder="Digite seu nome"
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/45 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-[#F87171] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="order-whatsapp" className="block text-xs font-medium text-slate-200">
                {isResellerPlan
                  ? 'Seu WhatsApp para receber o painel e comprovante (com DDD) *'
                  : 'Número de WhatsApp para envio do teste e plano (com DDD) *'}
              </label>
              <input
                id="order-whatsapp"
                type="tel"
                required
                value={customerWhatsApp}
                onChange={(e) => {
                  setCustomerWhatsApp(e.target.value);
                  if (confirmed) setConfirmed(false);
                }}
                placeholder="(11) 99999-9999"
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/45 px-3.5 py-2.5 font-mono text-sm text-white placeholder-slate-400 focus:border-[#F87171] focus:outline-none"
              />
            </div>

            {!isResellerPlan && (
              <>
                <div>
                  <label htmlFor="order-device" className="block text-xs font-medium text-slate-200">
                    Onde você vai assistir?
                  </label>
                  <select
                    id="order-device"
                    value={customerDevice}
                    onChange={(e) => {
                      setCustomerDevice(e.target.value);
                      if (confirmed) setConfirmed(false);
                    }}
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/45 px-3.5 py-2.5 text-sm text-white focus:border-[#F87171] focus:outline-none"
                  >
                    <option value="Smart TV (Samsung / LG)">Smart TV (Samsung / LG)</option>
                    <option value="TV Box / Fire Stick">TV Box / Fire Stick</option>
                    <option value="Celular Android / iOS">Celular Android / iOS</option>
                    <option value="PC / Notebook">PC / Notebook</option>
                  </select>
                </div>

                {/* Bloco informativo de Teste Rápido Automático interno (somente planos usuário) */}
                <div className="rounded-xl border border-white/20 bg-black/40 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <Zap className="h-3.5 w-3.5 text-[#FBBF24]" />
                      <span>Teste Rápido Automático</span>
                    </div>
                    {onOpenQuickTest && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenQuickTest({
                            phone: customerWhatsApp,
                            name: customerName,
                          })
                        }
                        className="text-xs font-semibold text-[#FCA5A5] hover:text-white hover:underline cursor-pointer"
                      >
                        Gerar somente o teste →
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300">
                    Ao continuar, o sistema gera automaticamente sua lista de teste e prepara o envio direto no WhatsApp.
                  </p>
                </div>
              </>
            )}

            {isResellerPlan && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <QrCode className="h-4 w-4 shrink-0" />
                  <span>Pagamento via PIX Instantâneo</span>
                </div>
                <p className="mt-1 text-xs text-slate-200">
                  Preencha seu nome e WhatsApp para gerar a chave PIX e o QR Code no valor exato de{' '}
                  <strong className="font-mono text-white">{formatBRL(order.price)}</strong>.
                </p>
              </div>
            )}

            {error && <p className="text-xs font-medium text-[#FCA5A5]">{error}</p>}

            {!confirmed ? (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={loadingTest}
                  className="btn-glow-shine inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
                >
                  {isResellerPlan ? (
                    <>
                      <QrCode className="h-4 w-4" />
                      Gerar Chave PIX ({formatBRL(order.price)})
                    </>
                  ) : loadingTest ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando teste e preparando WhatsApp...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Gerar Teste e Abrir WhatsApp
                    </>
                  )}
                </button>
                <a
                  href={mailtoUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-white/[0.08]"
                >
                  <Mail className="h-4 w-4" />
                  E-mail
                </a>
              </div>
            ) : isResellerPlan ? (
              <div className="space-y-4 pt-1">
                <div className="rounded-xl border border-emerald-500/35 bg-black/50 p-4">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      PIX gerado para {order.title}
                    </span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {formatBRL(order.price)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-lg">
                      <QRCodeSVG
                        value={pixPayload}
                        size={136}
                        level="M"
                        bgColor="#FFFFFF"
                        fgColor="#0F172A"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2.5 w-full">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-300">
                          <span>Chave PIX Aleatória</span>
                          <button
                            type="button"
                            onClick={handleCopyPixKey}
                            className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:underline cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            {copiedPixKey ? 'Chave copiada!' : 'Copiar Chave'}
                          </button>
                        </div>
                        <p className="mt-1 truncate rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-2 font-mono text-xs text-white select-all">
                          {NIKO_PIX_KEY}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-300">
                          <span>PIX Copia e Cola</span>
                          <button
                            type="button"
                            onClick={handleCopyPixCode}
                            className="inline-flex items-center gap-1 font-semibold text-[#FCA5A5] hover:underline cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            {copiedPixCode ? 'Código copiado!' : 'Copiar Código'}
                          </button>
                        </div>
                        <p className="mt-1 line-clamp-2 break-all rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-2 font-mono text-[11px] text-slate-200 select-all">
                          {pixPayload}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={ownerWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                  >
                    <Send className="h-4 w-4" />
                    Enviar Comprovante no WhatsApp ({formatWhatsAppDisplay(config.whatsappNumber)})
                  </a>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href={customerWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-glow-shine inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Enviar Chave PIX para {displayCustomerPhone || 'Cliente'}
                    </a>
                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      E-mail
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {apiWarning && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-400/35 bg-amber-500/10 p-3 text-xs text-amber-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{apiWarning}</span>
                  </div>
                )}

                {generatedTest && (
                  <div className="space-y-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        Lista do teste gerada automaticamente!
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyGeneratedList}
                        className="inline-flex items-center gap-1 font-medium text-white hover:underline cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        {copiedList ? 'Copiado!' : 'Copiar Lista'}
                      </button>
                    </div>
                    <pre className="max-h-36 overflow-y-auto whitespace-pre-wrap break-all rounded-lg border border-white/15 bg-black/50 p-3 font-mono text-[11px] leading-relaxed text-slate-100 select-all">
                      {generatedTest.reply}
                    </pre>
                  </div>
                )}

                <div className="flex flex-col gap-2.5">
                  <a
                    href={customerWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                  >
                    <Send className="h-4 w-4" />
                    Enviar Lista do Teste para {displayCustomerPhone || 'Cliente'}
                  </a>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href={ownerWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-glow-shine inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Enviar para Atendimento ({formatWhatsAppDisplay(config.whatsappNumber)})
                    </a>
                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      E-mail
                    </a>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/15 bg-black/35 px-5 py-3.5 sm:px-7">
          <span className="text-xs text-slate-400">
            {confirmed
              ? isResellerPlan
                ? 'Chave PIX e código prontos para pagamento'
                : 'Teste e pedido prontos para envio'
              : 'Preencha os dados para gerar'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
