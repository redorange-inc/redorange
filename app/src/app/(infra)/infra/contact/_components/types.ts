export interface ContactHero {
  badge: string;
  tag: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  schedule: string;
  mapUrl?: string;
}

export interface ServiceOption {
  value: string;
  label: string;
  description: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  placeholder: string;
  required: boolean;
}

export interface ContactFeature {
  title: string;
  description: string;
  iconName: string;
}

export interface ContactPageData {
  hero: ContactHero;
  info: ContactInfo;
  services: ServiceOption[];
  formFields: FormField[];
  features: ContactFeature[];
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
}
