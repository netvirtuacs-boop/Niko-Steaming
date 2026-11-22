import { MouseEvent, useState } from 'react';
import { Check, Zap } from 'lucide-react';
import {
  IptvPlan,
  PricingMode,
  ResellerPlan,
  SiteConfig,
} from '../types/site';
import {
  buildResellerPlans,
  buildSubscriberPlans,
  RESELLER_MONTHLY_PLANS,
  RESELLER_POSTPAID_PLANS,
} from '../data/defaultData';
import { formatBRL } from '../utils/formatters';

export interface SelectedOrder {
  type: 'subscriber' | 'reseller';
  title: string;
  subtitle: string;
  price: number;
  screens?: number;
  credits?: number;
}

interface PricingSectionProps {
  config: SiteConfig;
  mode: PricingMode;
  onModeChange: (mode: PricingMode) => void;
  onSelectOrder: (order: SelectedOrder) => void;
  onRequestTrial?: () => void;
}

const MODE_TABS: { id: PricingMode; label: string }[] = [
  { id: 'usuario', label: 'Planos Usuário' },
  { id: 'revenda_prepago', label: 'Plano Revenda Pré-Pago' },
  { id: 'revenda_mensalista', label: 'Plano Revenda Mensalista' },
  { id: 'revenda_pospago', label: 'Plano Franquia' },
];

interface CapacityBarProps {
  label: string;
  valueLabel: string;
  percentage: number;
  tone?: 'crimson' | 'cyan' | 'emerald';
  animationKey?: string;
  liveRatio?: number;
}

const TONE_STYLES: Record<'crimson' | 'cyan' | 'emerald', { gradient: string; glow: string }> = {
  crimson: {
    gradient: 'linear-gradient(90deg, #EF4444 0%, #FB7185 100%)',
    glow: '0 0 12px rgba(239, 68, 68, 0.55)',
  },
  cyan: {
    gradient: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
    glow: '0 0 12px rgba(245, 158, 11, 0.5)',
  },
  emerald: {
    gradient: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
    glow: '0 0 12px rgba(52, 211, 153, 0.45)',
  },
};

function CapacityProgressBar({
  label,
  valueLabel,
  percentage,
  tone = 'cyan',
  animationKey,
  liveRatio,
}: CapacityBarProps) {
  const clamped = Math.max(4, Math.min(100, percentage));
  const style = TONE_STYLES[tone];

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-slate-200">{label}</span>
        <span className="font-mono font-semibold tabular-nums text-white">{valueLabel}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(liveRatio !== undefined ? liveRatio * 100 : percentage)}
        className="progress-track h-2 w-full overflow-hidden rounded-full"
      >
        {liveRatio !== undefined ? (
          <div
            className="progress-fill-live h-full w-full rounded-full"
            style={{
              transform: `scaleX(${Math.max(0.03, Math.min(1, liveRatio))})`,
              backgroundImage: style.gradient,
              boxShadow: style.glow,
            }}
          />
        ) : (
          <div style={{ width: `${clamped}%` }} className="h-full overflow-hidden rounded-full">
            <div
              key={animationKey}
              className="progress-fill-animated h-full w-full rounded-full"
              style={{
                backgroundImage: style.gradient,
                boxShadow: style.glow,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const SUBSCRIBER_CAPACITY: Record<
  IptvPlan['id'],
  { label: string; valueLabel: string; percentage: number; tone: 'cyan' | 'crimson' }
> = {
  mensal: {
    label: 'Capacidade do servidor',
    valueLabel: '74% livre · 3 telas',
    percentage: 74,
    tone: 'cyan',
  },
  semestral: {
    label: 'Capacidade do servidor',
    valueLabel: '86% livre · 3 telas',
    percentage: 86,
    tone: 'cyan',
  },
  anual: {
    label: 'Rota dedicada VIP',
    valueLabel: '98% prioridade · 3 telas',
    percentage: 98,
    tone: 'cyan',
  },
};

const POSTPAID_CAPACITY: Record<
  string,
  { label: string; valueLabel: string; percentage: number }
> = {
  'franquia-ilimitada': {
    label: 'Servidores & Créditos',
    valueLabel: '1 Híbrido + Niko Play Premium · Ilimitado',
    percentage: 100,
  },
  'franquia-master': {
    label: 'Servidores & Créditos',
    valueLabel: '1 Híbrido + Max Player App · Ilimitado',
    percentage: 100,
  },
};

export function PricingSection({
  config,
  mode,
  onModeChange,
  onSelectOrder,
  onRequestTrial,
}: PricingSectionProps) {
  const [simulatedSales, setSimulatedSales] = useState<number>(25);

  const handleReactiveMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(100, Math.round(((event.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((event.clientY - rect.top) / rect.height) * 100)));
    event.currentTarget.style.setProperty('--mx', `${x}%`);
    event.currentTarget.style.setProperty('--my', `${y}%`);
  };

  const subscriberPlans: IptvPlan[] = buildSubscriberPlans(config);
  const resellerPlans: ResellerPlan[] = buildResellerPlans(config);

  const unitCostEstimate = config.resellerPlans.pack30 / 30;
  const estimatedRevenue = simulatedSales * config.plans.mensal;
  const estimatedCost = simulatedSales * unitCostEstimate;
  const estimatedProfit = Math.max(0, estimatedRevenue - estimatedCost);

  const sectionMetadata = (() => {
    switch (mode) {
      case 'usuario':
        return {
          kicker: 'Assinaturas IPTV · 3 Telas Simultâneas',
          title: 'Escolha o plano ideal para sua casa',
          description:
            'Todos os planos liberam acesso completo aos canais ao vivo, esportes, PPV e catálogo VOD com 3 telas simultâneas inclusas.',
        };
      case 'revenda_prepago':
        return {
          kicker: 'Painel Niko Streaming · Revenda Pré-Pago',
          title: 'Compre créditos sem prazo de validade',
          description:
            'Adquira pacotes de créditos antecipados com desconto progressivo, crie testes grátis ilimitados e ative clientes em segundos.',
        };
      case 'revenda_mensalista':
        return {
          kicker: 'Painel Niko Streaming · Revenda Mensalista',
          title: 'Valor fixo mensal com limite de clientes ativos',
          description:
            'Ideal para quem quer previsibilidade total de custos: pague uma mensalidade fixa e gerencie seus clientes até o limite do plano.',
        };
      case 'revenda_pospago':
        return {
          kicker: 'Painel Niko Streaming · Planos Franquia',
          title: 'Planos Franquia com créditos ilimitados e servidores dedicados',
          description:
            'Escolha o Plano Franquia Revenda (R$ 150,00/mês com 1 Servidor Híbrido + Niko Play Premium) ou o Plano Franquia Master (R$ 250,00/mês com 1 Servidor Híbrido + Servidor Max Player App).',
        };
    }
  })();

  const serverTelemetry = (() => {
    switch (mode) {
      case 'usuario':
        return [
          {
            label: 'Capacidade do servidor 4K',
            valueLabel: '72% alocada · 28% reserva',
            percentage: 72,
            tone: 'cyan' as const,
          },
          {
            label: 'Usuários ativos conectados',
            valueLabel: '1.842 / 2.500 conexões',
            percentage: 74,
            tone: 'crimson' as const,
          },
          {
            label: 'Estabilidade da rede Anti-Freeze',
            valueLabel: '99,9% operacional',
            percentage: 99,
            tone: 'emerald' as const,
          },
        ];
      case 'revenda_prepago':
        return [
          {
            label: 'Capacidade do cluster de revenda',
            valueLabel: '68% alocada · Escala livre',
            percentage: 68,
            tone: 'cyan' as const,
          },
          {
            label: 'Usuários ativos nos painéis',
            valueLabel: '3.420 / 5.000 ativos',
            percentage: 68,
            tone: 'crimson' as const,
          },
          {
            label: 'Disponibilidade dos geradores',
            valueLabel: '99,9% tempo ativo',
            percentage: 99,
            tone: 'emerald' as const,
          },
        ];
      case 'revenda_mensalista':
        return [
          {
            label: 'Capacidade do painel mensalista',
            valueLabel: '78% em operação',
            percentage: 78,
            tone: 'cyan' as const,
          },
          {
            label: 'Clientes ativos gerenciados',
            valueLabel: '4.120 / 5.000 ativos',
            percentage: 82,
            tone: 'crimson' as const,
          },
          {
            label: 'Margem de rotas dedicadas',
            valueLabel: '99,9% estabilidade',
            percentage: 99,
            tone: 'emerald' as const,
          },
        ];
      case 'revenda_pospago':
        return [
          {
            label: 'Liberação de créditos no painel',
            valueLabel: '100% Ilimitado · Sem restrições',
            percentage: 100,
            tone: 'cyan' as const,
          },
          {
            label: 'Opções de Franquia Mensal',
            valueLabel: 'R$ 150,00 Revenda · R$ 250,00 Master',
            percentage: 100,
            tone: 'crimson' as const,
          },
          {
            label: 'Servidores Híbridos & Apps',
            valueLabel: 'Niko Play Premium · Max Player App',
            percentage: 99,
            tone: 'emerald' as const,
          },
        ];
    }
  })();

  return (
    <section id="planos" className="border-b border-white/15 bg-transparent py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da seção */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#FCA5A5]">{sectionMetadata.kicker}</p>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.45)] sm:text-4xl">
              {sectionMetadata.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-100">
              {sectionMetadata.description}
            </p>
          </div>

          {onRequestTrial && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onMouseMove={handleReactiveMouseMove}
                onClick={onRequestTrial}
                className="btn-glow-shine inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                Teste Rápido Grátis
              </button>
            </div>
          )}
        </div>

        {/* Barra Organizada em Grid com as 4 Modalidades de Planos */}
        <div
          id="revenda"
          role="tablist"
          aria-label="Modalidade de planos"
          className="mt-8 grid grid-cols-1 gap-2 rounded-2xl border border-white/25 bg-black/45 p-2 shadow-xl shadow-black/30 backdrop-blur-xl backdrop-saturate-150 sm:grid-cols-2 lg:grid-cols-4"
        >
          {MODE_TABS.map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onMouseMove={handleReactiveMouseMove}
                onClick={() => onModeChange(tab.id)}
                className={`rounded-xl px-4 py-3 text-center text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer sm:text-sm ${
                  isActive
                    ? 'btn-plan-tab btn-plan-tab-active text-white'
                    : 'btn-plan-tab text-slate-100 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Monitor Tecnológico de Capacidade do Servidor & Usuários Ativos */}
        <div className="card-luminous mt-6 grid grid-cols-1 divide-y divide-white/15 rounded-2xl md:grid-cols-3 md:divide-x md:divide-y-0">
          {serverTelemetry.map((metric) => (
            <div key={metric.label} className="p-5">
              <CapacityProgressBar
                label={metric.label}
                valueLabel={metric.valueLabel}
                percentage={metric.percentage}
                tone={metric.tone}
                animationKey={`${mode}-${metric.label}`}
              />
            </div>
          ))}
        </div>

        {/* 1. PLANOS USUÁRIO */}
        {mode === 'usuario' && (
          <div className="mt-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/15 py-4 text-sm">
              <span className="text-slate-100">
                Todos os planos incluem <strong className="text-white">3 telas simultâneas</strong> na mesma assinatura.
              </span>
              <span className="font-mono text-xs font-semibold text-[#FCA5A5]">
                3 conexões ativas · Sem custo adicional
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {subscriberPlans.map((plan) => {
                const capacity = SUBSCRIBER_CAPACITY[plan.id];
                return (
                  <div
                    key={plan.id}
                    className="card-luminous flex flex-col justify-between rounded-2xl p-7"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-slate-300">Assinatura IPTV</span>
                        {plan.featured && (
                          <span className="font-semibold text-[#FCA5A5]">Mais Popular</span>
                        )}
                      </div>

                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-3 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2.5 font-display text-sm font-bold tracking-tight text-white">
                        {plan.durationLabel} · 3 telas simultâneas
                      </p>

                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="font-mono text-4xl font-bold tabular-nums text-white">
                          {formatBRL(plan.basePrice)}
                        </span>
                        <span className="text-xs text-slate-300">/ 3 telas</span>
                      </div>

                      {plan.savingsNote ? (
                        <p className="mt-1.5 text-xs text-slate-200">{plan.savingsNote}</p>
                      ) : (
                        <p className="mt-1.5 text-xs text-slate-300">
                          3 telas simultâneas inclusas
                        </p>
                      )}

                      <div className="mt-5 border-t border-white/15 pt-4">
                        <CapacityProgressBar
                          label={capacity.label}
                          valueLabel={capacity.valueLabel}
                          percentage={capacity.percentage}
                          tone={capacity.tone}
                          animationKey={`usuario-${plan.id}`}
                        />
                      </div>

                      <ul className="mt-5 space-y-3 border-t border-white/15 pt-5 text-sm text-slate-100">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F87171]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onMouseMove={handleReactiveMouseMove}
                      onClick={() =>
                        onSelectOrder({
                          type: 'subscriber',
                          title: plan.name,
                          subtitle: `${plan.durationLabel} · 3 telas simultâneas`,
                          price: plan.basePrice,
                          screens: 3,
                        })
                      }
                      className="btn-plan-secondary mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white whitespace-nowrap cursor-pointer"
                    >
                      Assinar Agora
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. PLANO REVENDA PRÉ-PAGO */}
        {mode === 'revenda_prepago' && (
          <div className="mt-10 space-y-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {resellerPlans.map((pack) => {
                const perCredit = pack.totalPrice / pack.credits;
                const creditRatio = Math.round((pack.credits / 100) * 100);
                return (
                  <div
                    key={pack.id}
                    className="card-luminous flex flex-col justify-between rounded-2xl p-7"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-slate-300">{pack.bonusLabel}</span>
                        {pack.featured && (
                          <span className="font-semibold text-[#FCA5A5]">Mais Popular</span>
                        )}
                      </div>

                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        {pack.name}
                      </h3>

                      <p className="mt-3 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2.5 font-display text-base font-bold tracking-tight text-white tabular-nums">
                        {pack.credits} créditos sem validade
                      </p>

                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="font-mono text-4xl font-bold tabular-nums text-white">
                          {formatBRL(pack.totalPrice)}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-slate-300">
                          ({formatBRL(perCredit)} / crédito)
                        </span>
                      </div>

                      <div className="mt-5 border-t border-white/15 pt-4">
                        <CapacityProgressBar
                          label="Capacidade de usuários ativos"
                          valueLabel={`${pack.credits} / 100 créditos`}
                          percentage={creditRatio}
                          tone="cyan"
                          animationKey={`prepago-${pack.id}`}
                        />
                      </div>

                      <ul className="mt-5 space-y-3 border-t border-white/15 pt-5 text-sm text-slate-100">
                        {pack.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F87171]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onMouseMove={handleReactiveMouseMove}
                      onClick={() =>
                        onSelectOrder({
                          type: 'reseller',
                          title: `Revenda Pré-Pago · ${pack.name}`,
                          subtitle: `${pack.credits} créditos sem validade + Painel Administrativo`,
                          price: pack.totalPrice,
                          credits: pack.credits,
                        })
                      }
                      className="btn-plan-secondary mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white whitespace-nowrap cursor-pointer"
                    >
                      Ativar Revenda Pré-Pago
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Simulador Interativo de Lucro para Revendedores */}
            <div className="card-luminous rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <p className="text-xs font-semibold text-[#FCA5A5]">
                    Calculadora de Margem Niko Revenda
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">
                    Simule seu lucro mensal com assinaturas recorrentes
                  </h3>
                  <p className="mt-2 text-sm text-slate-200">
                    Cada crédito equivale a 1 mês de acesso para um cliente final. Arraste o controle para estimar sua receita mensal vendendo ao valor sugerido de {formatBRL(config.plans.mensal)}.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-200">Clientes ativos por mês</span>
                        <span className="font-mono font-semibold tabular-nums text-white">
                          {simulatedSales} clientes
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={150}
                        step={5}
                        value={simulatedSales}
                        onChange={(e) => setSimulatedSales(Number(e.target.value))}
                        aria-label="Quantidade de clientes ativos por mês"
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-[#EF4444]"
                      />
                    </div>

                    <CapacityProgressBar
                      label="Capacidade utilizada no painel"
                      valueLabel={`${simulatedSales} / 150 ativos (${Math.round((simulatedSales / 150) * 100)}%)`}
                      percentage={(simulatedSales / 150) * 100}
                      tone="cyan"
                      liveRatio={simulatedSales / 150}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-white/15 rounded-xl border border-white/20 bg-black/35 backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:col-span-6">
                  <div className="p-5">
                    <div className="text-xs text-slate-300">Faturamento Bruto</div>
                    <div className="mt-1 font-mono text-xl font-bold tabular-nums text-white">
                      {formatBRL(estimatedRevenue)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-slate-300">Custo em Créditos</div>
                    <div className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-100">
                      {formatBRL(estimatedCost)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold text-[#FCA5A5]">Lucro Líquido Estimado</div>
                    <div className="mt-1 font-mono text-xl font-bold tabular-nums text-white">
                      {formatBRL(estimatedProfit)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PLANO REVENDA MENSALISTA */}
        {mode === 'revenda_mensalista' && (
          <div className="mt-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/15 py-4 text-sm">
              <span className="text-slate-100">
                Pague um valor fixo mensal e gerencie seus clientes sem precisar comprar créditos avulsos.
              </span>
              <span className="font-mono text-xs font-semibold text-[#FCA5A5]">
                Mensalidade fixa · Renovação facilitada
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {RESELLER_MONTHLY_PLANS.map((plan) => {
                const limitCount = plan.id === 'mensalista-revenda' ? 25 : plan.id === 'mensalista-master' ? 50 : 100;
                return (
                  <div
                    key={plan.id}
                    className="card-luminous flex flex-col justify-between rounded-2xl p-7"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-slate-300">Revenda Mensalista</span>
                        {plan.featured && (
                          <span className="font-semibold text-[#FCA5A5]">Mais Escolhido</span>
                        )}
                      </div>

                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-3 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2.5 font-display text-base font-bold tracking-tight text-white tabular-nums">
                        {plan.activeLimitLabel}
                      </p>

                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="font-mono text-4xl font-bold tabular-nums text-white">
                          {formatBRL(plan.monthlyPrice)}
                        </span>
                        <span className="text-xs text-slate-300">/ mês</span>
                      </div>

                      <p className="mt-1.5 text-xs text-slate-200">{plan.subtitle}</p>

                      <div className="mt-5 border-t border-white/15 pt-4">
                        <CapacityProgressBar
                          label="Limite de usuários ativos"
                          valueLabel={`${limitCount} / 100 ativos (${limitCount}%)`}
                          percentage={limitCount}
                          tone="cyan"
                          animationKey={`mensalista-${plan.id}`}
                        />
                      </div>

                      <ul className="mt-5 space-y-3 border-t border-white/15 pt-5 text-sm text-slate-100">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F87171]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onMouseMove={handleReactiveMouseMove}
                      onClick={() =>
                        onSelectOrder({
                          type: 'reseller',
                          title: `Revenda Mensalista · ${plan.name}`,
                          subtitle: `${plan.activeLimitLabel} · Valor fixo mensal`,
                          price: plan.monthlyPrice,
                        })
                      }
                      className="btn-plan-secondary mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white whitespace-nowrap cursor-pointer"
                    >
                      Contratar Mensalista
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. PLANO FRANQUIA */}
        {mode === 'revenda_pospago' && (
          <div className="mt-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/15 py-4 text-sm">
              <span className="text-slate-100">
                Créditos ilimitados com <strong className="text-white">1 Servidor Híbrido + Niko Play Premium (R$ 150,00)</strong> ou <strong className="text-white">+ Servidor Max Player App (R$ 250,00)</strong>.
              </span>
              <span className="font-mono text-xs font-semibold text-[#FCA5A5]">
                Créditos ilimitados · Mensalidade fixa
              </span>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
              {RESELLER_POSTPAID_PLANS.map((plan) => {
                const capacity = POSTPAID_CAPACITY[plan.id] ?? {
                  label: 'Capacidade de créditos',
                  valueLabel: '100% Ilimitado · Sem teto de ativos',
                  percentage: 100,
                };
                return (
                  <div
                    key={plan.id}
                    className="card-luminous flex flex-col justify-between rounded-2xl p-7 sm:p-8"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-slate-300">Plano Franquia</span>
                        <span className="font-semibold text-[#FCA5A5]">
                          {plan.featured ? 'Mais Completo' : 'Créditos Ilimitados'}
                        </span>
                      </div>

                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-3 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2.5 font-display text-base font-bold tracking-tight text-white">
                        {plan.minimumRule}
                      </p>

                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="font-mono text-4xl font-bold tabular-nums text-white">
                          {formatBRL(plan.pricePerActive)}
                        </span>
                        <span className="text-xs text-slate-300">/ mês</span>
                      </div>

                      <p className="mt-1.5 text-xs text-slate-200">{plan.billingCycle}</p>

                      <div className="mt-5 border-t border-white/15 pt-4">
                        <CapacityProgressBar
                          label={capacity.label}
                          valueLabel={capacity.valueLabel}
                          percentage={capacity.percentage}
                          tone="cyan"
                          animationKey={`franquia-${plan.id}`}
                        />
                      </div>

                      <ul className="mt-5 space-y-3 border-t border-white/15 pt-5 text-sm text-slate-100">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F87171]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onMouseMove={handleReactiveMouseMove}
                      onClick={() =>
                        onSelectOrder({
                          type: 'reseller',
                          title: plan.name,
                          subtitle: `${plan.minimumRule} · Mensalidade fixa de ${formatBRL(plan.pricePerActive)}`,
                          price: plan.pricePerActive,
                        })
                      }
                      className="btn-plan-secondary mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white whitespace-nowrap cursor-pointer"
                    >
                      Contratar {plan.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

