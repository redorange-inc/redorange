export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
}

export interface QuoteHero {
  badge: string;
  tag: string;
  title: string;
  description: string;
}

export interface ProductCategory {
  value: string;
  label: string;
  description: string;
}

export interface PurchaseType {
  value: string;
  label: string;
  description: string;
  iconName: string;
}

export interface QuoteBenefit {
  title: string;
  description: string;
  iconName: string;
}

export interface QuoteStep {
  number: number;
  title: string;
  description: string;
}

export interface QuotePageData {
  hero: QuoteHero;
  categories: ProductCategory[];
  purchaseTypes: PurchaseType[];
  benefits: QuoteBenefit[];
  steps: QuoteStep[];
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
}
