export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
}

// Hero Section
export interface HeroData {
  badge: string;
  tags: string[];
  title: string;
  titleHighlight: string;
  description: string;
}

// Stats / Vista General
export interface StatItem {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  iconName: string;
}

export interface StatsData {
  title: string;
  subtitle: string;
  items: StatItem[];
  flexibility?: {
    title: string;
    description: string;
  };
}

// Highlights (badges debajo del hero)
export interface HighlightItem {
  text: string;
  iconName: string;
}

export interface HighlightsData {
  items: HighlightItem[];
}

// Products Preview (carrusel)
export interface ProductPreview {
  id: string;
  title: string;
  description: string;
  iconName: string;
  items: string[];
  featured?: boolean;
}

export interface ProductsPreviewData {
  items: ProductPreview[];
}

// Brands
export interface BrandItem {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface BrandsData {
  title: string;
  subtitle: string;
  items: BrandItem[];
}
