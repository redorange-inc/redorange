export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
}

export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

export interface StatItem {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  iconName: string;
}

export interface StatsData {
  items: StatItem[];
}

export interface ProductCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  items: string[];
  featured?: boolean;
}

export interface ProductsData {
  categories: ProductCategory[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface TechnicalServicesData {
  items: ServiceItem[];
}

export interface BrandItem {
  id: string;
  name: string;
  logo?: string;
  category: string;
}

export interface BrandsData {
  items: BrandItem[];
}

export interface HighlightItem {
  text: string;
  iconName: string;
}

export interface HighlightsData {
  items: HighlightItem[];
}

export interface InfraPageData {
  hero: HeroData;
  stats: StatsData;
  products: ProductsData;
  services: TechnicalServicesData;
  brands: BrandsData;
  highlights: HighlightsData;
}
