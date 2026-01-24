export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
}

export interface ServicesHero {
  badge: string;
  tag: string;
  title: string;
  description: string;
}

export interface TechnicalService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  price?: string;
}

export interface ServiceBenefit {
  title: string;
  value: string;
  iconName: string;
}

export interface ServiceProcess {
  number: number;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServicesPageData {
  hero: ServicesHero;
  services: TechnicalService[];
  benefits: ServiceBenefit[];
  process: ServiceProcess[];
  faqs: ServiceFAQ[];
  contactPhone: string;
  contactWhatsapp: string;
}
