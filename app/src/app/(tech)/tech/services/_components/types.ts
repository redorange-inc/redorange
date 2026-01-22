export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
  message?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  services: ServiceDetail[];
}

export interface ServiceDetail {
  title: string;
  description: string;
}

export interface SupportLevel {
  name: string;
  description: string;
  responseTime: string;
  features: string[];
  iconName: string;
}

export interface TrainingItem {
  title: string;
  description: string;
  duration: string;
  level: 'básico' | 'intermedio' | 'avanzado';
  iconName: string;
}

export interface ProcessItem {
  title: string;
  description: string;
  iconName: string;
  steps: string[];
}

export interface ServiceCategoriesResponse {
  items: ServiceCategory[];
}

export interface SupportLevelsResponse {
  items: SupportLevel[];
}

export interface TrainingsResponse {
  items: TrainingItem[];
}

export interface ProcessesResponse {
  items: ProcessItem[];
}
