import { useEffect, useState } from 'react';
import {
  X,
  Send,
  Copy,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { SiteConfig } from '../types/site';
import { buildWhatsAppUrl, formatWhatsAppDisplay } from '../utils/formatters';
import { GeneratedTestResult, generateQuickTestFromApi } from '../utils/quickTestApi';

interface QuickTestModalProps {
  isOpen: boolean;
  config: SiteConfig;
  onClose: () => void;
  initialPhone?: string;
  initialName?: string;
}

export function QuickTestModal({
  isOpen,
  config,
  onClose,
  initialPhone,
  initialName,
}: QuickTestModalProps) {
  const [customerPhone, setCustomerPhone] = useState(initialPhone ?? '');
  const [customerName, setCustomerName] = useState(initialName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedTestResult | null>(null);
  const [submittedDigits, setSubmittedDigits] = useState('');
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedM3u, setCopiedM3u] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialPhone) setCustomerPhone(initialPhone);
      if (initialName) setCustomerName(initialName);
    }
  }, [isOpen, initialPhone, initialName]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rawDigits = customerPhone.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setError('Digite um número de WhatsApp válido com DDD (ex.: 11 99999-9999).');
      return;
    }

    setLoading(true);

    try {
      const { fullNumber, result: generated } = await generateQuickTestFromApi(
        config.quickTestUrl,
        rawDigits,
        customerName
      );
      setSubmittedDigits(fullNumber);
      setResult(generated);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Falha ao conectar com o servidor de testes. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFull = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.reply);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2500);
    } catch {
      setCopiedFull(false);
    }
  };

  const handleCopyM3u = async () => {
    if (!result?.m3uUrl) return;
    try {
      await navigator.clipboard.writeText(result.m3uUrl);
      setCopiedM3u(true);
      setTimeout(() => setCopiedM3u(false), 2500);
    } catch {
      setCopiedM3u(false);
    }
  };

  const handleResetModal = () => {
    setResult(null);
    setError('');
    setCopiedFull(false);
    setCopiedM3u(false);
  };

  const customerWhatsAppUrl = result
    ? `https://wa.me/${submittedDigits}?text=${encodeURIComponent(result.reply)}`
    : '';

  const ownerReplyWhatsAppUrl = result
    ? buildWhatsAppUrl(
        config.whatsappNumber,
        `Olá! Gerei um Teste Rápido na ${config.brandName} para o número ${formatWhatsAppDisplay(submittedDigits)} (Usuário: ${result.username || 'teste'}) e gostaria de atendimento.`
      )
    : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-test-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-4"
    >
      <div className="card-luminous flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/15 px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="text-xs font-semibold text-[#FCA5A5]">
              {config.brandName} · Lista Completa do Painel
            </p>
            <h3 id="quick-test-modal-title" className="mt-1 font-display text-2xl font-bold text-white">
              Gerar Teste Rápido
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Informe seu WhatsApp para gerar a lista completa conforme o painel, com 3 telas inclusas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de teste rápido"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
            <span>Fechar</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-7 sm:py-5">
        {!result ? (
          <form onSubmit={handleGenerate} className="space-y-4" noValidate>
            <div>
              <label htmlFor="qt-whatsapp" className="block text-xs font-medium text-slate-200">
                Seu número de WhatsApp (com DDD) *
              </label>
              <input
                id="qt-whatsapp"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/45 px-3.5 py-3 font-mono text-sm text-white placeholder-slate-400 focus:border-[#F87171] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="qt-name" className="block text-xs font-medium text-slate-200">
                Seu nome (opcional)
              </label>
              <input
                id="qt-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex.: João Silva"
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/45 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-[#F87171] focus:outline-none"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[#F87171]/45 bg-[#EF4444]/15 p-3 text-xs text-[#FECACA]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-glow-shine inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando lista completa no painel...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Gerar Teste e Enviar no WhatsApp
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Lista completa gerada conforme o painel!</span>
              </div>
              <p className="mt-1 text-xs text-zinc-300">
                WhatsApp informado:{' '}
                <strong className="font-mono text-white">
                  {formatWhatsAppDisplay(submittedDigits)}
                </strong>
              </p>
            </div>

            {/* Resumo rápido de credenciais */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/15 bg-black/45 p-4 text-xs">
              <div>
                <span className="text-slate-300">Usuário</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-white select-all">
                  {result.username || '—'}
                </p>
              </div>
              <div>
                <span className="text-slate-300">Senha</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-white select-all">
                  {result.password || '—'}
                </p>
              </div>
              <div>
                <span className="text-slate-300">Servidor / DNS</span>
                <p className="mt-0.5 truncate font-mono text-xs text-slate-100 select-all">
                  {result.dns || '—'}
                </p>
              </div>
              <div>
                <span className="text-slate-300">Vencimento</span>
                <p className="mt-0.5 font-mono text-xs font-medium tabular-nums text-[#FCA5A5]">
                  {result.expiresAt || 'Teste ativo'}
                </p>
              </div>
            </div>

            {/* Lista Completa Retornada pelo Painel */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">
                  Dados Completos do Painel (Lista + M3U + Plano)
                </span>
                {result.m3uUrl && (
                  <button
                    type="button"
                    onClick={handleCopyM3u}
                    className="inline-flex items-center gap-1 font-medium text-[#FCA5A5] hover:underline cursor-pointer"
                  >
                    <Copy className="h-3 w-3" />
                    {copiedM3u ? 'M3U copiado!' : 'Copiar Link M3U'}
                  </button>
                )}
              </div>
              <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap break-all rounded-xl border border-white/15 bg-black/45 p-3.5 font-mono text-xs leading-relaxed text-slate-100 select-all">
                {result.reply}
              </pre>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <a
                href={customerWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                <Send className="h-4 w-4" />
                Enviar Lista no WhatsApp
              </a>
              <button
                type="button"
                onClick={handleCopyFull}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.08] cursor-pointer"
              >
                <Copy className="h-4 w-4" />
                {copiedFull ? 'Lista copiada!' : 'Copiar Lista Completa'}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-3 text-xs">
              <button
                type="button"
                onClick={handleResetModal}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                Gerar para outro número
              </button>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={ownerReplyWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-emerald-400 hover:underline"
                >
                  Falar no WhatsApp ({formatWhatsAppDisplay(config.whatsappNumber)})
                  <ExternalLink className="h-3 w-3" />
                </a>
                {result.payUrl && (
                  <a
                    href={result.payUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#F87171] hover:underline"
                  >
                    Link de Renovação
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/15 bg-black/35 px-5 py-3.5 sm:px-7">
          {result ? (
            <button
              type="button"
              onClick={handleResetModal}
              className="text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Gerar para outro número
            </button>
          ) : (
            <span className="text-xs text-slate-400">3 telas inclusas no teste</span>
          )}
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
