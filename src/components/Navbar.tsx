import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SiteConfig } from '../types/site';
import { HEADER_LOGO_BANNER_IMAGE } from '../data/defaultData';

interface NavbarProps {
  config: SiteConfig;
  onRequestTrial: () => void;
}

export function Navbar({ config, onRequestTrial }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);

  const navLinks = [
    { href: '#planos', label: 'Planos' },
    { href: '#revenda', label: 'Revenda' },
    { href: '#dispositivos', label: 'Dispositivos' },
    { href: '#duvidas', label: 'Dúvidas' },
  ];

  return (
    <header className="relative z-40 border-b border-white/15 bg-[#121216] shadow-lg shadow-black/35">
      {/* Banner em toda a largura do cabeçalho dimensionado para exibir a imagem inteira (2464x1194) */}
      <div className="relative w-full aspect-[2464/1194] overflow-hidden">
        {!bannerFailed && (
          <img
            src={HEADER_LOGO_BANNER_IMAGE}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            onError={() => setBannerFailed(true)}
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />
        )}

        {/* Scrim neutro no topo para preservar contraste do menu ampliado sobre o banner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/75 via-black/35 to-transparent sm:h-48 lg:h-64"
        />

        {/* Barra de navegação no topo sobre o banner, com logo livre sem quadrado */}
        <div className="relative z-10 mx-auto flex max-w-[1440px] items-start justify-between gap-3 px-4 py-2 sm:px-6 sm:py-3 md:gap-4 lg:gap-6 lg:px-8 lg:py-4">
          {/* Zona 1: Marca sem caixa/quadrado ao redor (3x maior) */}
          <a
            href="#inicio"
            aria-label={config.brandName}
            className="flex items-center whitespace-nowrap shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171]"
          >
            <img
              src={config.logoUrl}
              alt={config.brandName}
              referrerPolicy="no-referrer"
              className="h-32 w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] sm:h-48 md:h-40 lg:h-56 xl:h-[300px] 2xl:h-[336px]"
            />
          </a>

          {/* Zona 2: Links de navegação em linha única (3x maiores no desktop) */}
          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center pt-2 lg:pt-3 md:gap-4 lg:gap-5 xl:gap-7 2xl:gap-8 font-display md:text-xl lg:text-[26px] xl:text-[34px] 2xl:text-[42px] font-bold tracking-tight leading-none text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap shrink-0 py-1.5 text-white transition-colors duration-150 hover:text-rose-200 hover:underline hover:underline-offset-8 hover:decoration-[#EF4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171] rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zona 3: Ação primária única */}
          <div className="flex items-center gap-3 pt-2 lg:pt-3 shrink-0">
            <button
              type="button"
              onClick={onRequestTrial}
              className="btn-glow-shine hidden sm:inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171] focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap shrink-0 cursor-pointer"
            >
              Teste Rápido
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex md:hidden items-center justify-center rounded-xl border border-white/25 bg-black/50 p-2 text-white backdrop-blur-md hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu móvel */}
      {mobileMenuOpen && (
        <div className="border-t border-white/15 bg-black/85 px-4 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 font-display text-2xl font-bold text-slate-100 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestTrial();
              }}
              className="btn-glow-shine mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white cursor-pointer"
            >
              Gerar Teste Rápido
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
