import { useState, useEffect } from 'react';
import { X, RotateCcw, Save } from 'lucide-react';
import { SiteConfig } from '../types/site';
import { DEFAULT_SITE_CONFIG } from '../data/defaultData';

interface CustomizeDataModalProps {
  isOpen: boolean;
  config: SiteConfig;
  onSave: (updated: SiteConfig) => void;
  onClose: () => void;
}

export function CustomizeDataModal({
  isOpen,
  config,
  onSave,
  onClose,
}: CustomizeDataModalProps) {
  const [draft, setDraft] = useState<SiteConfig>(config);

  useEffect(() => {
    if (isOpen) {
      setDraft(config);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(DEFAULT_SITE_CONFIG);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-md"
    >
      <div className="card-luminous my-8 w-full max-w-2xl rounded-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <p className="text-xs font-medium text-[#F87171]">Configuração do Proprietário</p>
            <h3 id="customize-modal-title" className="mt-1 font-display text-xl font-bold text-white">
              Personalizar Meus Dados e Preços
            </h3>
            <p className="mt-1 text-xs text-zinc-400">
              Altere seu WhatsApp, e-mail, redes e valores dos planos. Tudo é atualizado na hora no site.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar configurador"
            className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cfg-brand" className="block text-xs font-medium text-zinc-300">
                Nome da Marca
              </label>
              <input
                id="cfg-brand"
                type="text"
                value={draft.brandName}
                onChange={(e) => setDraft({ ...draft, brandName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-sm text-white focus:border-[#DC2626] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="cfg-whatsapp" className="block text-xs font-medium text-zinc-300">
                WhatsApp (com DDI 55 + DDD)
              </label>
              <input
                id="cfg-whatsapp"
                type="text"
                value={draft.whatsappNumber}
                onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })}
                placeholder="5511987593140"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 font-mono text-sm text-white focus:border-[#DC2626] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="cfg-email" className="block text-xs font-medium text-zinc-300">
                E-mail de Atendimento
              </label>
              <input
                id="cfg-email"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-sm text-white focus:border-[#DC2626] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="cfg-instagram" className="block text-xs font-medium text-zinc-300">
                Instagram / Telegram
              </label>
              <input
                id="cfg-instagram"
                type="text"
                value={draft.instagramHandle}
                onChange={(e) => setDraft({ ...draft, instagramHandle: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-sm text-white focus:border-[#DC2626] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cfg-pix" className="block text-xs font-medium text-zinc-300">
              Observação de Pagamento / PIX
            </label>
            <input
              id="cfg-pix"
              type="text"
              value={draft.pixNote}
              onChange={(e) => setDraft({ ...draft, pixNote: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-sm text-white focus:border-[#DC2626] focus:outline-none"
            />
          </div>

          <div className="border-t border-white/[0.08] pt-4">
            <h4 className="text-xs font-semibold text-zinc-300">
              Valores dos Planos Assinante (R$)
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="cfg-p1" className="block text-[11px] text-zinc-400">
                  Mensal
                </label>
                <input
                  id="cfg-p1"
                  type="number"
                  step="0.10"
                  value={draft.plans.mensal}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      plans: { ...draft.plans, mensal: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 font-mono text-sm text-white focus:border-[#DC2626] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="cfg-p6" className="block text-[11px] text-zinc-400">
                  Semestral
                </label>
                <input
                  id="cfg-p6"
                  type="number"
                  step="0.10"
                  value={draft.plans.semestral}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      plans: { ...draft.plans, semestral: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 font-mono text-sm text-white focus:border-[#DC2626] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="cfg-p12" className="block text-[11px] text-zinc-400">
                  Anual
                </label>
                <input
                  id="cfg-p12"
                  type="number"
                  step="0.10"
                  value={draft.plans.anual}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      plans: { ...draft.plans, anual: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 font-mono text-sm text-white focus:border-[#DC2626] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-4">
            <h4 className="text-xs font-semibold text-zinc-300">
              Valores dos Pacotes de Revenda (R$)
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="cfg-r10" className="block text-[11px] text-zinc-400">
                  Revenda (10 Créditos)
                </label>
                <input
                  id="cfg-r10"
                  type="number"
                  step="1"
                  value={draft.resellerPlans.pack10}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      resellerPlans: { ...draft.resellerPlans, pack10: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 font-mono text-sm text-white focus:border-[#DC2626] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="cfg-r30" className="block text-[11px] text-zinc-400">
                  Master (30 Créditos)
                </label>
                <input
                  id="cfg-r30"
                  type="number"
                  step="1"
                  value={draft.resellerPlans.pack30}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      resellerPlans: { ...draft.resellerPlans, pack30: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 font-mono text-sm text-white focus:border-[#DC2626] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="cfg-r100" className="block text-[11px] text-zinc-400">
                  Ultra (100 Créditos)
                </label>
                <input
                  id="cfg-r100"
                  type="number"
                  step="1"
                  value={draft.resellerPlans.pack100}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      resellerPlans: { ...draft.resellerPlans, pack100: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/45 px-3 py-2 font-mono text-sm text-white focus:border-[#DC2626] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restaurar Padrão
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-glow-shine inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Salvar Dados no Site
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
