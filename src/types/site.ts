export type PricingMode =
  | 'usuario'
  | 'revenda_prepago'
  | 'revenda_mensalista'
  | 'revenda_pospago';

export interface SiteConfig {
  brandName: string;
  tagline: string;
  logoUrl: string;
  whatsappNumber: string;
  email: string;
  telegramHandle: string;
  instagramHandle: string;
  pixNote: string;
  quickTestUrl: string;
  plans: {
    mensal: number;
    semestral: number;
    anual: number;
  };
  resellerPlans: {
    pack10: number;
    pack30: number;
    pack100: number;
  };
}

export interface IptvPlan {
  id: 'mensal' | 'semestral' | 'anual';
  name: string;
  durationLabel: string;
  basePrice: number;
  featured?: boolean;
  savingsNote?: string;
  features: string[];
}

export interface ResellerPlan {
  id: 'pack10' | 'pack30' | 'pack100';
  name: string;
  credits: number;
  totalPrice: number;
  featured?: boolean;
  bonusLabel: string;
  features: string[];
}

export interface ResellerMonthlyPlan {
  id: string;
  name: string;
  activeLimitLabel: string;
  monthlyPrice: number;
  featured?: boolean;
  subtitle: string;
  features: string[];
}

export interface ResellerPostpaidPlan {
  id: string;
  name: string;
  minimumRule: string;
  pricePerActive: number;
  featured?: boolean;
  billingCycle: string;
  features: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string;
  planLabel: string;
  city: string;
  rating: number;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
