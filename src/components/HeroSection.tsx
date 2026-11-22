import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Film,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SiteConfig } from '../types/site';

export type SceneMode = 'cinema' | 'sports' | 'series' | 'kids';

interface HeroSectionProps {
  config: SiteConfig;
  onRequestTrial: () => void;
  onSelectResellerMode: () => void;
}

interface ChannelScene {
  id: string;
  sceneTitle: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  panClass: 'player-pan-a' | 'player-pan-b' | 'player-pan-c';
  scoreBadge?: string;
}

interface PreviewChannel {
  id: SceneMode;
  tabLabel: string;
  channelName: string;
  nextProgram: string;
  resolution: string;
  bitrate: string;
  progress: number;
  category: string;
  scenes: ChannelScene[];
}

const PREVIEW_CHANNELS: PreviewChannel[] = [
  {
    id: 'cinema',
    tabLabel: 'Filmes de Ação 4K',
    channelName: 'Niko Action Premiere UHD',
    nextProgram: 'Áudio Dual 5.1 · Dublado e Legendado',
    resolution: '4K HDR',
    bitrate: '24 fps',
    progress: 48,
    category: 'Filmes de Ação',
    scenes: [
      {
        id: 'action-chase',
        sceneTitle: 'Velocidade Noturna · Perseguição na Via Expressa',
        subtitle: 'Cena 1 de 4 · Áudio 5.1 Surround',
        imageSrc: '/src/assets/images/action_chase_scene_1795019062355.jpg',
        imageAlt: 'Cena de perseguição de carros esportivos em alta velocidade sob chuva à noite',
        panClass: 'player-pan-a',
      },
      {
        id: 'action-combat',
        sceneTitle: 'Código de Resgate · Infiltração no Porto',
        subtitle: 'Cena 2 de 4 · Lançamento 4K UHD',
        imageSrc: '/src/assets/images/action_combat_scene_1795019012452.jpg',
        imageAlt: 'Cena de filme de ação tática em doca industrial à noite com fogo ao fundo',
        panClass: 'player-pan-b',
      },
      {
        id: 'action-explosion',
        sceneTitle: 'Operação Horizonte · Extração no Topo',
        subtitle: 'Cena 3 de 4 · Qualidade IMAX 4K',
        imageSrc: '/src/assets/images/action_explosion_scene_1795019011261.jpg',
        imageAlt: 'Cena de explosão com helicóptero sobre arranha-céu em filme de ação',
        panClass: 'player-pan-c',
      },
      {
        id: 'action-moto',
        sceneTitle: 'Fuga Implacável · Caçada na Ponte',
        subtitle: 'Cena 4 de 4 · Sem Travamentos',
        imageSrc: '/src/assets/images/action_motorcycle_chase_1795019106972.jpg',
        imageAlt: 'Cena de perseguição de moto em alta velocidade na ponte à noite',
        panClass: 'player-pan-a',
      },
    ],
  },
  {
    id: 'sports',
    tabLabel: 'Jogos Ao Vivo',
    channelName: 'Niko Sports Arena 4K',
    nextProgram: '22:00 · Mesa Redonda & Melhores Momentos',
    resolution: '4K UHD',
    bitrate: '60 fps',
    progress: 76,
    category: 'Futebol Ao Vivo',
    scenes: [
      {
        id: 'soccer-duel',
        sceneTitle: 'Brasileirão Série A · Disputa na Entrada da Área',
        subtitle: 'Transmissão Direta do Estádio · 60fps',
        imageSrc: '/src/assets/images/soccer_match_action_1795019104917.jpg',
        imageAlt: 'Jogadores de futebol disputando a bola em jogo ao vivo à noite no estádio',
        panClass: 'player-pan-a',
        scoreBadge: 'RUB 2 × 1 VER · 74\' 2ºT',
      },
      {
        id: 'soccer-goal',
        sceneTitle: 'Copa Continental · Chute no Ângulo & Defesa Espetacular',
        subtitle: 'Câmera Exclusiva Atrás do Gol · 4K',
        imageSrc: '/src/assets/images/soccer_goal_shot_1795019107171.jpg',
        imageAlt: 'Lance de chute ao gol com goleiro saltando no estádio lotado',
        panClass: 'player-pan-c',
        scoreBadge: 'FOR 3 × 2 LIV · 86\' 2ºT',
      },
      {
        id: 'soccer-arena',
        sceneTitle: 'Super Clássico Nacional · Casa Cheia sob Refletores',
        subtitle: 'Sinal Redundante Anti-Freeze · PT-BR',
        imageSrc: '/src/assets/images/player_sports_live_1795002425232.jpg',
        imageAlt: 'Transmissão ao vivo de partida de futebol em estádio iluminado em 4K',
        panClass: 'player-pan-b',
        scoreBadge: 'AO VIVO · RODADA DECISIVA',
      },
    ],
  },
  {
    id: 'series',
    tabLabel: 'Séries',
    channelName: 'Niko Séries On Demand',
    nextProgram: 'Auto-Play · Próximo episódio em seguida',
    resolution: 'Full HD',
    bitrate: '1080p',
    progress: 81,
    category: 'Catálogo Maratona',
    scenes: [
      {
        id: 'series-drama',
        sceneTitle: 'Código Noturno · T04 Ep. 02',
        subtitle: 'Suspense Policial · Dublado PT-BR',
        imageSrc: '/src/assets/images/player_series_drama_1795002425037.jpg',
        imageAlt: 'Cena dramática de série investigativa noturna em alta definição',
        panClass: 'player-pan-b',
      },
      {
        id: 'series-sci',
        sceneTitle: 'Horizonte Carmesim · Ep. Especial',
        subtitle: 'Ficção Científica · 4K UHD',
        imageSrc: '/src/assets/images/player_cinema_movie_1795002424257.jpg',
        imageAlt: 'Cena cinematográfica de série de ficção científica em 4K',
        panClass: 'player-pan-a',
      },
    ],
  },
  {
    id: 'kids',
    tabLabel: 'Desenhos',
    channelName: 'Niko Kids HD',
    nextProgram: '19:30 · Sessão Família Dublada',
    resolution: '4K UHD',
    bitrate: '60 fps',
    progress: 55,
    category: 'Infantil & Família',
    scenes: [
      {
        id: 'kids-clouds',
        sceneTitle: 'Guardiões das Nuvens · Animação 3D',
        subtitle: 'Conteúdo Livre · Áudio em Português',
        imageSrc: '/src/assets/images/player_kids_animation_1795002425154.jpg',
        imageAlt: 'Cena de animação infantil 3D colorida acima das nuvens',
        panClass: 'player-pan-c',
      },
    ],
  },
];

export function HeroSection({
  config,
  onRequestTrial,
  onSelectResellerMode,
}: HeroSectionProps) {
  const [activeChannelId, setActiveChannelId] = useState<SceneMode>('cinema');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoCycle, setAutoCycle] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(2538);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const activeChannel =
    PREVIEW_CHANNELS.find((item) => item.id === activeChannelId) ?? PREVIEW_CHANNELS[0];
  const currentScene = activeChannel.scenes[sceneIndex % activeChannel.scenes.length];

  // Troca continuamente entre as cenas reais dentro do filme/jogo e entre categorias quando ativado
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setSceneIndex((prevScene) => {
        const nextScene = prevScene + 1;
        if (nextScene < activeChannel.scenes.length) {
          return nextScene;
        }
        if (autoCycle) {
          setActiveChannelId((prevCat) => {
            const currentIndex = PREVIEW_CHANNELS.findIndex((c) => c.id === prevCat);
            const nextIndex = (currentIndex + 1) % PREVIEW_CHANNELS.length;
            return PREVIEW_CHANNELS[nextIndex].id;
          });
        }
        return 0;
      });
    }, 3400);
    return () => window.clearInterval(timer);
  }, [isPlaying, autoCycle, activeChannel.scenes.length]);

  // Relógio de reprodução ao vivo em segundos
  useEffect(() => {
    if (!isPlaying) return;
    const clock = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(clock);
  }, [isPlaying]);

  const formatTimecode = (totalSecs: number) => {
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const hrs = Math.floor(totalSecs / 3600);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectChannel = (id: SceneMode) => {
    setActiveChannelId(id);
    setSceneIndex(0);
    setAutoCycle(false);
    setIsPlaying(true);
  };

  const handlePrevScene = () => {
    setSceneIndex((prev) =>
      prev === 0 ? activeChannel.scenes.length - 1 : prev - 1
    );
  };

  const handleNextScene = () => {
    setSceneIndex((prev) => (prev + 1) % activeChannel.scenes.length);
  };

  return (
    <section id="inicio" className="relative overflow-hidden border-b border-white/15 bg-transparent">
      {/* Iluminação suave neutra apenas atrás do título sem cobrir as cores da imagem */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(ellipse_65%_50%_at_72%_28%,rgba(239,68,68,0.16),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-16 sm:px-6 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Coluna Esquerda: Proposta de Valor */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-sm font-semibold tracking-wide text-[#FCA5A5]">
                {config.brandName} · Servidor Dedicado Anti-Freeze
              </p>

              <h1 className="mt-4 text-balance font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]">
                TV ao Vivo, Filmes e Séries em 4K sem Travamentos.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-100 sm:text-lg">
                Acesse mais de 25.000 canais nacionais e internacionais, esportes ao vivo, Pay-Per-View e um catálogo com mais de 90.000 filmes, séries e desenhos direto na sua Smart TV, TV Box ou celular.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onRequestTrial}
                  className="btn-glow-shine inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171] focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Gerar Teste Rápido
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onSelectResellerMode}
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/25 backdrop-blur-xl transition-all duration-150 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Quero Ser Revendedor
                </button>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-6 text-xs font-medium text-slate-100">
              <span>{config.pixNote}</span>
              <span aria-hidden="true">·</span>
              <span>3 telas simultâneas inclusas</span>
              <span aria-hidden="true">·</span>
              <span>Suporte técnico diário</span>
            </div>
          </div>

          {/* Coluna Direita: Interface Interativa do Player Niko com Várias Cenas Reais */}
          <div className="flex flex-col lg:col-span-6">
            <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/25 bg-black/45 shadow-[0_24px_60px_-14px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150">
              {/* Barra superior do Player Smart TV */}
              <div className="flex items-center justify-between gap-4 border-b border-white/15 bg-white/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={config.logoUrl}
                    alt={config.brandName}
                    referrerPolicy="no-referrer"
                    className="h-12 w-auto object-contain shrink-0"
                  />
                  <span className="truncate text-xs font-medium text-slate-100">
                    Guia Eletrônico (EPG) · Player 4K
                  </span>
                </div>
                <span className="font-mono text-xs tabular-nums text-slate-200 whitespace-nowrap shrink-0">
                  {activeChannel.resolution} · {activeChannel.bitrate}
                </span>
              </div>

              {/* Abas de seleção rápida de categoria no Player */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto border-b border-white/15 bg-black/35 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  {PREVIEW_CHANNELS.map((channel) => {
                    const isActive = channel.id === activeChannel.id;
                    return (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => handleSelectChannel(channel.id)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#DC2626] text-white shadow-sm'
                            : 'text-slate-200 hover:bg-white/15 hover:text-white'
                        }`}
                      >
                        {channel.tabLabel}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setAutoCycle((prev) => !prev)}
                  className="text-[11px] font-medium text-slate-200 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {autoCycle ? 'Troca automática: ON' : 'Troca automática: OFF'}
                </button>
              </div>

              {/* Tela de reprodução com múltiplas cenas reais de ação e futebol ao vivo */}
              <div className="relative flex min-h-[310px] flex-1 flex-col justify-between overflow-hidden bg-[#121216]">
                <div className="absolute inset-0 overflow-hidden">
                  {activeChannel.scenes.map((scene, idx) => {
                    const isCurrent = idx === sceneIndex % activeChannel.scenes.length;
                    const hasFailed = failedImages[scene.id];
                    return (
                      <div
                        key={scene.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        {hasFailed ? (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#24161A] via-[#17161B] to-[#0E0E12] p-6 text-center">
                            <Film className="h-8 w-8 text-[#FCA5A5]" />
                            <span className="mt-2 text-xs font-medium text-slate-200">
                              {scene.sceneTitle}
                            </span>
                          </div>
                        ) : (
                          <img
                            key={`${scene.id}-${isCurrent && isPlaying ? 'active' : 'idle'}`}
                            src={scene.imageSrc}
                            alt={scene.imageAlt}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [scene.id]: true }))
                            }
                            className={`h-full w-full object-cover ${
                              isCurrent && isPlaying ? scene.panClass : 'scale-100'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Scrim neutro para garantir contraste >= 4.5:1 sobre os quadros */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/65"
                  />
                </div>

                {/* Conteúdo OSD (On-Screen Display) da TV com placar em jogos */}
                <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 p-5">
                  <div className="space-y-1.5">
                    <div className="text-xs text-slate-100">
                      <span className="text-slate-300">{activeChannel.category}</span>
                      <span className="mx-2 text-slate-400" aria-hidden="true">
                        /
                      </span>
                      <span className="font-semibold text-white">{activeChannel.channelName}</span>
                    </div>
                    {currentScene.scoreBadge && (
                      <div className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/65 px-2.5 py-1 font-mono text-[11px] font-bold tabular-nums text-white backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>{currentScene.scoreBadge}</span>
                      </div>
                    )}
                  </div>

                  <span className="font-mono text-xs font-semibold tabular-nums text-[#FCA5A5]">
                    {isPlaying ? `AO VIVO · ${formatTimecode(elapsedSeconds)}` : 'PAUSADO'}
                  </span>
                </div>

                {/* Overlay inferior estilo cinema / guia EPG com navegação entre cenas */}
                <div className="relative z-10 p-5">
                  <div className="mb-3.5 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#FCA5A5]">
                        {currentScene.subtitle}
                      </p>
                      <h2 className="mt-0.5 truncate font-display text-lg font-bold text-white sm:text-xl">
                        {currentScene.sceneTitle}
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                        {activeChannel.nextProgram}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {activeChannel.scenes.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={handlePrevScene}
                            aria-label="Cena anterior"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-black/55 text-white hover:border-white/50 hover:bg-black/75 cursor-pointer"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleNextScene}
                            aria-label="Próxima cena"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-black/55 text-white hover:border-white/50 hover:bg-black/75 cursor-pointer"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsPlaying((prev) => !prev)}
                        aria-label={isPlaying ? 'Pausar cena' : 'Reproduzir cena'}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-[#DC2626] text-white transition-colors hover:bg-[#EF4444] cursor-pointer"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 fill-current" />
                        ) : (
                          <Play className="h-4 w-4 fill-current translate-x-0.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Indicadores das cenas dentro do filme/jogo */}
                  {activeChannel.scenes.length > 1 && (
                    <div className="mb-3 flex items-center gap-1.5">
                      {activeChannel.scenes.map((scene, idx) => {
                        const isActiveScene = idx === sceneIndex % activeChannel.scenes.length;
                        return (
                          <button
                            key={scene.id}
                            type="button"
                            onClick={() => setSceneIndex(idx)}
                            aria-label={`Assistir ${scene.sceneTitle}`}
                            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                              isActiveScene
                                ? 'flex-1 bg-[#EF4444]'
                                : 'w-6 bg-white/30 hover:bg-white/55'
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}

                  <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] tabular-nums text-slate-200">
                    <span>Rota CDN Brasil · Anti-Freeze</span>
                    <span>{activeChannel.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                    <div
                      className="h-full rounded-full bg-[#DC2626] transition-all duration-300"
                      style={{ width: `${activeChannel.progress}%` }}
                    />
                  </div>

                  <div className="mt-3.5 flex items-center justify-between text-xs text-zinc-200">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5">
                        <Volume2 className="h-3.5 w-3.5" />
                        Áudio PT-BR / Dual
                      </span>
                      <span>Legenda Opcional</span>
                    </div>
                    <button
                      type="button"
                      onClick={onRequestTrial}
                      aria-label="Gerar teste rápido para assistir"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-[#F87171] cursor-pointer"
                    >
                      <span>Gerar teste rápido</span>
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
