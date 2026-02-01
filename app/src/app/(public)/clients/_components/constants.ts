import { ClientCategory, ClientType, ServiceType } from '@/actions/fn-clients';

export const ui = {
  glassCard: 'border-border/40 bg-background/40 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.25)] backdrop-blur-xl',
  softBorder: 'border border-border/50',
  hoverLift: 'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(234,88,12,0.3)]',
};

export const toKebabCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

// -- constants

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  gobierno_regional: 'Gobierno Regional',
  municipalidad: 'Municipalidad',
  entidad_publica: 'Entidad Pública',
  empresa_privada: 'Empresa Privada',
  persona_juridica: 'Persona Jurídica',
  persona_natural: 'Persona Natural',
};

export const CLIENT_CATEGORY_LABELS: Record<ClientCategory, string> = {
  public_entities: 'Entidades Públicas',
  private_entities: 'Entidades Privadas',
  other_clients: 'Otros Clientes',
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  tech: 'Tecnología (TI)',
  infra: 'Equipamiento',
  digital: 'Telecomunicaciones',
};

export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  tech: '#06b6d4',
  infra: '#f97316',
  digital: '#8b5cf6',
};

// Fallback hex colors for charts (recharts needs hex/rgb)
export const SERVICE_HEX_COLORS = {
  tech: '#0891b2', // --tech light mode
  infra: '#e11d48', // --infra light mode
  digital: '#ea580c', // --digital light mode
};

export const SERVICE_TYPE_CSS: Record<ServiceType, string> = {
  tech: 'bg-tech/20 text-tech border-tech/30',
  infra: 'bg-infra/20 text-infra border-infra/30',
  digital: 'bg-digital/20 text-digital border-digital/30',
};
