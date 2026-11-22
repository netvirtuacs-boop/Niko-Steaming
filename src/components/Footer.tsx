import { useState } from 'react';
import { Settings } from 'lucide-react';
import { SiteConfig } from '../types/site';
import { PROMO_BACKDROP_IMAGE } from '../data/defaultData';
import { buildWhatsAppUrl, formatWhatsAppDisplay } from '../utils/formatters';

interface FooterProps {
  config: SiteConfig;
  onOpenCustomize: () => void;
}

export function Footer({ config, onOpenCustomize }: FooterProps) {
  const [bgFailed, setBgFailed] = useState(false);

  const whatsappLink = buildWhatsAppUrl(
    config.whatsappNumber,
    `Olá! Vim pelo site da ${config.brandName} e gostaria de atendimento.`
  );

  return (
    <footer className="relative overflow-hidden border-t border-white/20 bg-black/55 py-16 text-sm text-slate-200 backdrop-blur-xl backdrop-saturate-150">
      {!bgFailed && (
        <img
          src={PROMO_BACKDROP_IMAGE}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={() => setBgFailed(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-45"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/75"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src={config.logoUrl}
              alt={config.brandName}
              referrerPolicy="no-referrer"
              className="h-32 w-auto object-contain drop-shadow-[0_6px_18px_rgba(239,68,68,0.28)] sm:h-44"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-200">
              {config.tagline}. Estabilidade, qualidade de cinema e painel de revenda profissional com suporte diário.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-sm font-semibold text-white">Navegação</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#planos" className="hover:text-white transition-colors">
                  Planos IPTV
                </a>
              </li>
              <li>
                <a href="#revenda" className="hover:text-white transition-colors">
                  Painel de Revenda
                </a>
              </li>
              <li>
                <a href="#dispositivos" className="hover:text-white transition-colors">
                  Dispositivos Compatíveis
                </a>
              </li>
              <li>
                <a href="#duvidas" className="hover:text-white transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-display text-sm font-semibold text-white">Atendimento</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {formatWhatsAppDisplay(config.whatsappNumber)}
                </a>
              </li>
              <li>
                <a href={`mailto:${config.email}`} className="hover:text-white transition-colors">
                  E-mail: {config.email}
                </a>
              </li>
              <li>Social: {config.instagramHandle}</li>
            </ul>

            <button
              type="button"
              onClick={onOpenCustomize}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/[0.15] cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 text-[#FCA5A5]" />
              Personalizar Meus Dados
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-slate-300 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {config.brandName}. Todos os direitos reservados.
          </p>
          <p>{config.pixNote}</p>
        </div>
      </div>
    </footer>
  );
}
