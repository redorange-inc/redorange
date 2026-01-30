export const TECH = '#06b6d4';
export const TECH_ACCENT = '#0891b2';

export const ui = {
  glassCard: 'border-border/40 bg-background/40 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.25)] backdrop-blur-xl',
  softBorder: 'border border-border/50',
  hoverLift: 'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(6,182,212,0.4)]',
};

export const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-500/20 text-blue-400',
  backend: 'bg-green-500/20 text-green-400',
  database: 'bg-purple-500/20 text-purple-400',
  devops: 'bg-orange-500/20 text-orange-400',
  tools: 'bg-pink-500/20 text-pink-400',
};

export const statusColors: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  planned: 'bg-blue-500/20 text-blue-400',
};

export const statusLabels: Record<string, string> = {
  completed: 'Completado',
  'in-progress': 'En Progreso',
  planned: 'Planificado',
};

export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
};
