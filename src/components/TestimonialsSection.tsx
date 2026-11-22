import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/defaultData';

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});

  const total = TESTIMONIALS.length;

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Exibe 3 depoimentos em desktop, 2 em tablet e 1 em mobile mantendo ordem contínua
  const visibleItems = [
    TESTIMONIALS[activeIndex % total],
    TESTIMONIALS[(activeIndex + 1) % total],
    TESTIMONIALS[(activeIndex + 2) % total],
  ];

  return (
    <section
      id="depoimentos"
      aria-label="Depoimentos de clientes e revendedores"
      className="border-b border-white/15 bg-transparent py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho + Resumo de Nota + Controles do Carrossel */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#FCA5A5]">
              Confiança Comprovada · Avaliações 5 Estrelas
            </p>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.45)] sm:text-4xl">
              Quem assina e revende recomenda a estabilidade
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-100">
              Relatos reais de clientes e parceiros de todo o Brasil que assistem e gerenciam seus painéis sem travamentos.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
            <div className="card-luminous flex items-center gap-3 rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-1 text-amber-300" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]" />
                ))}
              </div>
              <span className="font-mono text-sm font-bold tabular-nums text-white">
                5,0 / 5,0
              </span>
              <span className="text-xs text-slate-200 whitespace-nowrap">
                Avaliação dos clientes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Depoimento anterior"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur-xl transition-all duration-150 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171] cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Próximo depoimento"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur-xl transition-all duration-150 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171] cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Grade do Carrossel (1 card no mobile, 2 no tablet, 3 no desktop) */}
        <div
          aria-live="polite"
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {visibleItems.map((item, position) => {
            const avatarBroken = failedAvatars[item.id];
            return (
              <article
                key={`${item.id}-${activeIndex}`}
                className={`animate-testimonial-in card-luminous flex flex-col justify-between rounded-2xl p-7 ${
                  position === 1 ? 'hidden md:flex' : ''
                } ${position === 2 ? 'hidden lg:flex' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-1 text-amber-300"
                      aria-label={`${item.rating} de 5 estrelas`}
                    >
                      {Array.from({ length: item.rating }).map((_, starIdx) => (
                        <Star key={starIdx} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="font-mono text-xs tabular-nums text-slate-300">
                      {item.rating.toFixed(1).replace('.', ',')} · Verificado
                    </span>
                  </div>

                  <blockquote className="mt-5 text-sm leading-relaxed text-slate-100 sm:text-[15px]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 flex items-center gap-3.5 border-t border-white/15 pt-5">
                  {avatarBroken ? (
                    <div
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#F87171]/45 bg-[#EF4444]/20 font-display text-sm font-bold text-[#FECACA]"
                    >
                      {item.initials}
                    </div>
                  ) : (
                    <img
                      src={item.avatarUrl}
                      alt={`Foto de ${item.name}`}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedAvatars((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="h-12 w-12 shrink-0 rounded-full border-2 border-white/35 object-cover object-top shadow-md"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-display text-base font-bold text-white">
                      {item.name}
                    </div>
                    <div className="truncate text-xs text-slate-300">
                      {item.planLabel} · {item.city}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Indicadores de Posição do Carrossel */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Selecionar depoimento">
            {TESTIMONIALS.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Ver depoimento de ${item.name}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'w-8 bg-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                      : 'w-2.5 bg-white/35 hover:bg-white/60'
                  }`}
                />
              );
            })}
          </div>

          <span className="font-mono text-xs tabular-nums text-slate-200">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
