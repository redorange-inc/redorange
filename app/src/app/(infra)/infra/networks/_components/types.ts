export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
}

export interface NetworksHero {
  badge: string;
  tag: string;
  title: string;
  description: string;
}

export interface NetworkService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface NetworkBenefit {
  title: string;
  description: string;
  iconName: string;
}

export interface NetworkProject {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
}

export interface NetworkTechnology {
  id: string;
  name: string;
  icon?: string;
}

export interface NetworksPageData {
  hero: NetworksHero;
  services: NetworkService[];
  benefits: NetworkBenefit[];
  projects: NetworkProject[];
  technologies: NetworkTechnology[];
  contactPhone: string;
  contactWhatsapp: string;
}
