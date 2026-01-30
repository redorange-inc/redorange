export const TECH = '#06b6d4';
export const TECH_ACCENT = '#0891b2';

export const ui = {
  glassCard: 'border-border/40 bg-background/40 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.25)] backdrop-blur-xl',
  softBorder: 'border border-border/50',
  hoverLift: 'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(6,182,212,0.4)]',
};

export const levelColors: Record<string, string> = {
  básico: 'bg-green-500/20 text-green-400',
  intermedio: 'bg-yellow-500/20 text-yellow-400',
  avanzado: 'bg-red-500/20 text-red-400',
};

export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
};
