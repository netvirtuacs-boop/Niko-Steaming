import {
  FaqItem,
  IptvPlan,
  ResellerMonthlyPlan,
  ResellerPlan,
  ResellerPostpaidPlan,
  SiteConfig,
  TestimonialItem,
} from '../types/site';

export const NIKO_LOGO_PATH =
  '/assets/aistudio/niko-streaming-revenda-logo__2_.png_2K_202608140649-removebg-preview-removebg-preview__1__34d2802c.png';

export const HEADER_LOGO_BANNER_IMAGE =
  '/assets/aistudio/niko-streaming-banner_2464x1194__1_.webp_2K_202608140602_25a2b78e.jpeg';

export const PROMO_BACKDROP_IMAGE =
  '/src/assets/images/movie_posters_backdrop_1795006004957.jpg';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'Niko Streaming Revenda',
  tagline: 'IPTV 4K Ultra HD & Painel de Revenda Profissional',
  logoUrl: NIKO_LOGO_PATH,
  whatsappNumber: '5511987593140',
  email: 'netvirtuacs@gmail.com',
  telegramHandle: '@nikostreaming',
  instagramHandle: '@nikostreamingrevenda',
  pixNote: 'Ativação imediata via PIX ou Cartão de Crédito',
  quickTestUrl: 'https://nikoplay.com.br/api/chatbot/mGzHzq6Aqc/dM4jRkyQ62',
  plans: {
    mensal: 20.0,
    semestral: 90.0,
    anual: 150.0,
  },
  resellerPlans: {
    pack10: 50.0,
    pack30: 120.0,
    pack100: 300.0,
  },
};

function formatSavings(months: number, monthlyPrice: number, planPrice: number): string | undefined {
  const diff = monthlyPrice * months - planPrice;
  if (diff <= 0) return undefined;
  return `Economize ${diff.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

export function buildSubscriberPlans(config: SiteConfig): IptvPlan[] {
  const semestralSavings = formatSavings(6, config.plans.mensal, config.plans.semestral);
  const anualSavings = formatSavings(12, config.plans.mensal, config.plans.anual);

  return [
    {
      id: 'mensal',
      name: 'Plano Mensal',
      durationLabel: '30 dias de acesso',
      basePrice: config.plans.mensal,
      features: [
        '3 telas simultâneas inclusas',
        'Mais de 25.000 canais ao vivo',
        'Mais de 90.000 filmes e séries VOD',
        'Qualidade 4K UHD, Full HD e HD',
        'Servidores com tecnologia Anti-Freeze',
      ],
    },
    {
      id: 'semestral',
      name: 'Plano Semestral',
      durationLabel: '6 meses de acesso',
      basePrice: config.plans.semestral,
      savingsNote: semestralSavings,
      features: [
        '3 telas simultâneas inclusas',
        'Mais de 25.000 canais ao vivo',
        'Catálogo VOD atualizado diariamente',
        'Qualidade 4K UHD sem travamentos',
        'Controle parental e troca de aparelho',
      ],
    },
    {
      id: 'anual',
      name: 'Plano Anual VIP',
      durationLabel: '12 meses de acesso',
      basePrice: config.plans.anual,
      featured: true,
      savingsNote: anualSavings ? `Melhor custo-benefício · ${anualSavings}` : 'Melhor custo-benefício',
      features: [
        '3 telas simultâneas inclusas',
        'Acesso total 4K UHD + 60fps nos esportes',
        'Catálogo completo com +90.000 títulos',
        'Rota dedicada Anti-Freeze + EPG 7 dias',
        'Atendimento VIP e renovação simplificada',
      ],
    },
  ];
}

export function buildResellerPlans(config: SiteConfig): ResellerPlan[] {
  return [
    {
      id: 'pack10',
      name: 'Pré-Pago Revenda',
      credits: 10,
      totalPrice: config.resellerPlans.pack10,
      bonusLabel: 'Ideal para começar',
      features: [
        'Painel administrativo web próprio',
        'Geração ilimitada de testes de 6h',
        'Créditos sem prazo de validade',
        'Ativação de clientes em segundos',
        'Material de apoio e suporte técnico',
      ],
    },
    {
      id: 'pack30',
      name: 'Pré-Pago Master',
      credits: 30,
      totalPrice: config.resellerPlans.pack30,
      featured: true,
      bonusLabel: 'Mais escolhido pelos revendedores',
      features: [
        'Painel completo com gestão de vencimentos',
        'Criação de sub-revendedores liberada',
        'Testes automáticos e renovação em 1 clique',
        'Créditos cumulativos sem expiração',
        'Suporte direto com nossa central técnica',
      ],
    },
    {
      id: 'pack100',
      name: 'Pré-Pago Ultra',
      credits: 100,
      totalPrice: config.resellerPlans.pack100,
      bonusLabel: 'Maior margem de lucro',
      features: [
        'Menor custo unitário por crédito',
        'Estrutura para criar sua própria rede',
        'DNS personalizado e rotas redundantes',
        'Atendimento prioritário 7 dias por semana',
        'Relatórios de consumo e ativos em tempo real',
      ],
    },
  ];
}

export const RESELLER_MONTHLY_PLANS: ResellerMonthlyPlan[] = [
  {
    id: 'mensalista-revenda',
    name: 'Mensalista Revenda',
    activeLimitLabel: '25 créditos mensais',
    monthlyPrice: 50.0,
    subtitle: 'Mensalidade fixa com 25 créditos por mês (R$ 2,00 / crédito)',
    features: [
      'Painel web completo com gestão de vencimentos',
      '25 créditos mensais para ativar seus clientes',
      'Geração ilimitada de testes de 6h',
      '3 telas simultâneas por cliente',
      'Suporte técnico dedicado via WhatsApp',
    ],
  },
  {
    id: 'mensalista-master',
    name: 'Mensalista Master',
    activeLimitLabel: '50 créditos mensais',
    monthlyPrice: 75.0,
    featured: true,
    subtitle: 'Melhor custo-benefício mensal (R$ 1,50 / crédito)',
    features: [
      '50 créditos mensais no painel administrativo',
      'Renovação automática e alertas no painel',
      'Sub-revendedores liberados sem taxa extra',
      '3 telas simultâneas por assinatura',
      'Atendimento prioritário e DNS personalizado',
    ],
  },
  {
    id: 'mensalista-ultra',
    name: 'Mensalista Ultra',
    activeLimitLabel: '100 ativos mensais',
    monthlyPrice: 120.0,
    subtitle: 'Escala máxima com 100 ativos por R$ 1,20 cada',
    features: [
      'Até 100 clientes ativos simultâneos no mês',
      'Custo efetivo de R$ 1,20 por cliente ativo',
      'Painel master com relatórios em tempo real',
      'Criação ilimitada de sub-revendedores',
      'Rota Anti-Freeze dedicada e suporte VIP',
    ],
  },
];

export const RESELLER_POSTPAID_PLANS: ResellerPostpaidPlan[] = [
  {
    id: 'franquia-ilimitada',
    name: 'Plano Franquia Revenda',
    minimumRule: '1 Servidor Híbrido · Niko Play Premium',
    pricePerActive: 150.0,
    billingCycle: 'Mensalidade fixa de R$ 150,00 / mês · Créditos ilimitados',
    features: [
      '1 Servidor Híbrido incluído',
      'Servidor Niko Play Premium liberado',
      'Créditos ilimitados para ativar e renovar clientes',
      'Mensalidade fixa de R$ 150,00/mês sem cobrança por ativo',
      'Geração ilimitada de testes grátis e 3 telas por cliente',
    ],
  },
  {
    id: 'franquia-master',
    name: 'Plano Franquia Master',
    minimumRule: '1 Servidor Híbrido + Servidor Max Player App',
    pricePerActive: 250.0,
    featured: true,
    billingCycle: 'Mensalidade fixa de R$ 250,00 / mês · Créditos ilimitados',
    features: [
      '1 Servidor Híbrido de alta performance incluído',
      'Servidor Max Player App completo integrado',
      'Créditos ilimitados para ativar e renovar clientes',
      'Criação ilimitada de sub-revendedores no painel',
      'Servidores 4K UHD Anti-Freeze e suporte VIP prioritário',
    ],
  },
];

export const MAX_PLAYER_LOGO_PATH =
  '/assets/aistudio/41sI-OiSMcL-removebg-preview_6ebf91c9.png';

export const MAX_PLAYER_TUTORIAL_VIDEO_PATH =
  '/assets/aistudio/WhatsApp_Video_2026-11-18_at_15.28.57_e0248ef4.mp4';

export const COMPATIBLE_DEVICES = [
  {
    name: 'Smart TVs',
    detail: 'Samsung Tizen, LG webOS, Android TV, Roku e Philips',
    apps: 'Max Player · IBO Player · DuplexPlay · SmartOne',
  },
  {
    name: 'TV Box & Fire Stick',
    detail: 'Amazon Fire TV Stick, Mi Box, Chromecast 4K e Apple TV',
    apps: 'Max Player · TiviMate · XCIPTV · IPTV Smarters',
  },
  {
    name: 'Celulares & Tablets',
    detail: 'Smartphones Android e iPhone / iPad (iOS)',
    apps: 'Max Player · IPTV Smarters Pro · GSE Smart',
  },
  {
    name: 'Computadores & Web',
    detail: 'Windows, macOS e navegadores modernos',
    apps: 'Max Player Web · VLC · IPTV Smarters Desktop',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Como funciona o teste grátis da Niko Streaming?',
    answer:
      'Você solicita seu teste pelo formulário ou diretamente no nosso WhatsApp informando qual aparelho utiliza. Enviamos um acesso temporário completo para você testar a estabilidade, qualidade 4K e catálogo antes de assinar.',
  },
  {
    id: 'faq-2',
    question: 'Qual velocidade de internet é necessária para rodar em 4K?',
    answer:
      'Para canais em HD e Full HD, uma conexão estável de 15 Mbps é suficiente. Para transmissões em 4K UHD sem buffering, recomendamos conexão acima de 30 Mbps (preferencialmente via cabo de rede ou Wi-Fi 5GHz).',
  },
  {
    id: 'faq-3',
    question: 'Preciso instalar antena ou passar cabos na parede?',
    answer:
      'Não. Todo o serviço funciona 100% pela internet usando aplicativos compatíveis na sua Smart TV, TV Box, Fire Stick, celular ou computador. A ativação leva menos de 5 minutos.',
  },
  {
    id: 'faq-4',
    question: 'Posso assistir em mais de uma tela ao mesmo tempo?',
    answer:
      'Sim. Todos os nossos planos já incluem acesso para até 3 telas simultâneas sem custo extra, permitindo assistir em diferentes aparelhos da sua casa ao mesmo tempo.',
  },
  {
    id: 'faq-5',
    question: 'Como funciona o Painel de Revenda Niko Streaming?',
    answer:
      'Ao adquirir um pacote de créditos para revenda, você recebe login e senha do nosso painel administrativo. Nele você cria testes grátis ilimitados, ativa novos clientes, renova assinaturas e pode até cadastrar seus próprios sub-revendedores. Os créditos nunca expiram.',
  },
  {
    id: 'faq-6',
    question: 'Quais são as formas de pagamento e prazo de liberação?',
    answer:
      'Aceitamos PIX com liberação imediata em poucos minutos e Cartão de Crédito. Assim que o pagamento é confirmado, você recebe suas credenciais de acesso e instruções de instalação passo a passo.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'dep-1',
    name: 'Rafael Mendes',
    initials: 'RM',
    avatarUrl: '/src/assets/images/avatar_rafael_mendes_1795007758247.jpg',
    planLabel: 'Assinante · Plano Anual VIP',
    city: 'Campinas, SP',
    rating: 5,
    quote:
      'Eu sofria com travamentos toda quarta-feira nos jogos da Libertadores em outro servidor. Depois que ativei o Plano Anual com o Max Player na minha Smart TV LG, as transmissões rodam lisas em 4K sem nenhum corte.',
  },
  {
    id: 'dep-2',
    name: 'Camila Ferreira',
    initials: 'CF',
    avatarUrl: '/src/assets/images/avatar_camila_ferreira_1795007759514.jpg',
    planLabel: 'Revendedora · Mensalista Master',
    city: 'Belo Horizonte, MG',
    rating: 5,
    quote:
      'Antes eu perdia clientes porque meu antigo painel caía no fim de semana e o suporte demorava horas. Na Niko Streaming gero testes em segundos e hoje mantenho mais de 45 assinantes renovando todo mês.',
  },
  {
    id: 'dep-3',
    name: 'Thiago Oliveira',
    initials: 'TO',
    avatarUrl: '/src/assets/images/avatar_thiago_oliveira_1795007759948.jpg',
    planLabel: 'Assinante · Plano Semestral',
    city: 'Curitiba, PR',
    rating: 5,
    quote:
      'Divido as 3 telas entre a TV da sala, o Fire Stick do quarto e o celular nas viagens. A qualidade Full HD e 4K carrega na hora e o catálogo de filmes e séries recebe novidades toda semana.',
  },
  {
    id: 'dep-4',
    name: 'Juliana Costa',
    initials: 'JC',
    avatarUrl: '/src/assets/images/avatar_juliana_costa_1795007759368.jpg',
    planLabel: 'Revendedora · Pré-Pago Ultra',
    city: 'Goiânia, GO',
    rating: 5,
    quote:
      'Comecei com 10 créditos para testar a estabilidade e em dois meses migrei para o pacote Ultra. O envio automático do teste completo direto no WhatsApp acelerou muito o fechamento de novos clientes.',
  },
  {
    id: 'dep-5',
    name: 'Marcos Vinícius Lima',
    initials: 'ML',
    avatarUrl: '/src/assets/images/avatar_marcos_lima_1795007760090.jpg',
    planLabel: 'Assinante · Plano Anual VIP',
    city: 'Recife, PE',
    rating: 5,
    quote:
      'Cancelei três streamings separados que pesavam no orçamento da família. Agora assisto futebol ao vivo, canais abertos e séries dubladas em um só aplicativo, com ativação que levou menos de cinco minutos.',
  },
  {
    id: 'dep-6',
    name: 'Bruno Almeida',
    initials: 'BA',
    avatarUrl: '/src/assets/images/avatar_bruno_almeida_1795007760774.jpg',
    planLabel: 'Revendedor · Plano Franquia Ilimitado',
    city: 'Porto Alegre, RS',
    rating: 5,
    quote:
      'Com o Plano Franquia de R$ 150,00 por mês e créditos ilimitados, consegui escalar minha carteira de clientes sem me preocupar com estoque. Todos os assinantes elogiam a estabilidade nos jogos.',
  },
];
