import { Tv, Smartphone, Laptop, MonitorPlay, Zap, PlayCircle, CheckCircle2 } from 'lucide-react';
import {
  COMPATIBLE_DEVICES,
  MAX_PLAYER_LOGO_PATH,
  MAX_PLAYER_TUTORIAL_VIDEO_PATH,
} from '../data/defaultData';

export function FeaturesDevicesSection() {
  const deviceIcons = [Tv, MonitorPlay, Smartphone, Laptop];

  return (
    <section
      id="dispositivos"
      className="border-b border-white/15 bg-transparent py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#FCA5A5]">Infraestrutura & Compatibilidade</p>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.45)] sm:text-4xl">
            Estabilidade em horários de pico e funcionamento em qualquer tela
          </h2>
        </div>

        {/* Card Principal de Infraestrutura em 2 Colunas Internas */}
        <div className="card-luminous mt-10 grid grid-cols-1 items-center gap-8 rounded-2xl p-7 lg:grid-cols-12 lg:p-9">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
              <Zap className="h-5 w-5 text-[#F87171]" />
              <span>Servidores Dedicados com Roteamento Anti-Freeze</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              Transmissão contínua mesmo em finais de campeonato
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Nossa rede utiliza balanceamento automático de carga e múltiplos servidores espelhados no Brasil para evitar congelamentos e quedas de bitrate quando milhares de pessoas assistem ao mesmo tempo.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-white/15 rounded-xl border border-white/20 bg-black/35 backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:col-span-5">
            <div className="p-5">
              <div className="font-mono text-xl font-bold tabular-nums text-white">
                &lt; 28 ms
              </div>
              <div className="mt-1 text-xs text-slate-200">Latência média nacional</div>
            </div>
            <div className="p-5">
              <div className="font-mono text-xl font-bold tabular-nums text-white">
                EPG 7 dias
              </div>
              <div className="mt-1 text-xs text-slate-200">Guia de grade completo</div>
            </div>
            <div className="p-5">
              <div className="font-mono text-xl font-bold tabular-nums text-white">
                H.265 / 4K
              </div>
              <div className="mt-1 text-xs text-slate-200">Compressão eficiente</div>
            </div>
          </div>
        </div>

        {/* Aplicativo em Destaque: Max Player + Vídeo Tutorial */}
        <div className="card-luminous-featured mt-6 grid grid-cols-1 items-center gap-8 rounded-2xl p-7 lg:grid-cols-12 lg:p-9">
          <div className="space-y-6 lg:col-span-7">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <img
                src={MAX_PLAYER_LOGO_PATH}
                alt="Aplicativo Max Player"
                referrerPolicy="no-referrer"
                className="h-24 w-auto shrink-0 object-contain drop-shadow-[0_6px_16px_rgba(255,255,255,0.2)]"
              />
              <div>
                <p className="text-xs font-semibold text-[#FCA5A5]">
                  Aplicativo Recomendado · Instalação Rápida
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                  Max Player — Otimizado para 4K e EPG Completo
                </h3>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-100 sm:text-base">
              Assista com máxima fluidez usando o aplicativo Max Player na sua Smart TV Samsung, LG, Android TV, Fire TV Stick, TV Box ou celular. Assista ao vídeo tutorial ao lado para configurar seu acesso em menos de 2 minutos.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/15 bg-black/35 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FCA5A5]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>1. Baixe o App</span>
                </div>
                <p className="mt-1 text-xs text-slate-200">
                  Busque por Max Player na loja da sua Smart TV ou TV Box.
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-black/35 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FCA5A5]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>2. Usuário e Senha</span>
                </div>
                <p className="mt-1 text-xs text-slate-200">
                  Digite os dados de acesso recebidos no WhatsApp e clique em Login.
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-black/35 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FCA5A5]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>3. Crie seu Perfil</span>
                </div>
                <p className="mt-1 text-xs text-slate-200">
                  Adicione um nome de perfil e acesse canais ao vivo, filmes e séries.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4 font-mono text-xs text-slate-200">
              <span>Smart TV · TV Box · Fire Stick · Mobile</span>
              <span className="font-semibold text-[#FCA5A5]">Suporte completo incluso</span>
            </div>
          </div>

          <div className="flex flex-col items-center lg:col-span-5">
            <div className="w-full max-w-[270px] rounded-2xl border border-white/25 bg-black/60 p-2.5 shadow-2xl">
              <div className="mb-2 flex items-center justify-between gap-2 px-1.5 pt-0.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                  <PlayCircle className="h-4 w-4 text-[#F87171]" />
                  Tutorial Max Player
                </span>
                <span className="font-mono text-[10px] font-semibold text-[#FCA5A5]">
                  Passo a passo
                </span>
              </div>
              <div className="aspect-[9/16] max-h-[440px] w-full overflow-hidden rounded-xl border border-white/15 bg-black">
                <video
                  src={MAX_PLAYER_TUTORIAL_VIDEO_PATH}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label="Vídeo tutorial de como configurar o aplicativo Max Player"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dispositivos Compatíveis */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COMPATIBLE_DEVICES.map((device, index) => {
            const Icon = deviceIcons[index % deviceIcons.length];
            return (
              <div
                key={device.name}
                className="card-luminous flex flex-col justify-between rounded-2xl p-6"
              >
                <div>
                  <Icon className="h-6 w-6 text-[#F87171]" />
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {device.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {device.detail}
                  </p>
                </div>
                <p className="mt-5 border-t border-white/15 pt-3.5 font-mono text-[11px] text-slate-300">
                  {device.apps}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
