export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
  message?: string;
}

export interface MethodologyItem {
  title: string;
  description: string;
  iconName: string;
  benefits: string[];
}

export interface PrincipleItem {
  acronym: string;
  name: string;
  description: string;
  iconName: string;
}

export interface ArchitectureItem {
  name: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  iconName: string;
}

export interface MethodologyResponse {
  items: MethodologyItem[];
}

export interface PrinciplesResponse {
  items: PrincipleItem[];
}

export interface ArchitecturesResponse {
  items: ArchitectureItem[];
}

export interface WorkflowResponse {
  items: WorkflowStep[];
}
