import type { IconName } from 'lucide-react/dynamic';

export type { IconName };

export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
  message?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  schedule: string;
  mapUrl: string;
}

export interface ContactFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[];
}

export interface ServiceOption {
  value: string;
  label: string;
  description: string;
}

export interface Feature {
  title: string;
  description: string;
  iconName: IconName;
}

export interface ContactPageData {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };
  info: ContactInfo;
  services: ServiceOption[];
  formFields: ContactFormField[];
  features: Feature[];
}
