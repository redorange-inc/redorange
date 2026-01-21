export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
  message?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'completed' | 'in-progress' | 'planned';
  technologies: string[];
  iconName: string;
  features: string[];
}

export interface TechStackItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
  description: string;
  iconName: string;
}

export interface IntegrationItem {
  name: string;
  description: string;
  type: string;
  iconName: string;
}

export interface FutureItem {
  name: string;
  description: string;
  expectedDate: string;
  iconName: string;
}

export interface ProjectsResponse {
  items: ProjectItem[];
}

export interface TechStackResponse {
  items: TechStackItem[];
}

export interface IntegrationsResponse {
  items: IntegrationItem[];
}

export interface FutureResponse {
  items: FutureItem[];
}
