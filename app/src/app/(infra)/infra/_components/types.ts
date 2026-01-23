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

// Impact Chart Data (Donut)
export interface ImpactItem {
  name: string;
  value: number;
  color: string;
}

export interface ImpactData {
  title: string;
  subtitle: string;
  items: ImpactItem[];
}

// Time Series Data (Area/Line Chart)
export interface TimeSeriesPoint {
  month: string;
  ventas: number;
  importaciones: number;
}

export interface TimeSeriesData {
  title: string;
  subtitle: string;
  items: TimeSeriesPoint[];
}

// Achievements
export interface Achievement {
  title: string;
  subtitle: string;
  value: string;
  iconName: string;
}

export interface AchievementsData {
  title: string;
  items: Achievement[];
}

// Brands
export interface BrandItem {
  id: string;
  name: string;
  category: string;
}

export interface BrandsData {
  title: string;
  subtitle: string;
  items: BrandItem[];
}

// CTA Section
export interface CtaData {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction: {
    label: string;
    href: string;
  };
  features: string[];
}
