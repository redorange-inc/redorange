import type { ColorTheme } from '@/actions/fn-services';

export type { ColorTheme } from '@/actions/fn-services';

export const getThemeClasses = (theme: ColorTheme) => {
  const themes = {
    tech: {
      text: 'text-tech',
      textAccent: 'text-tech-accent',
      textForeground: 'text-tech-foreground',
      bg: 'bg-tech',
      bgSolid: 'bg-tech-solid',
      bgHover: 'bg-tech-hover',
      border: 'border-tech',
      gradient: 'gradient-tech',
      ring: 'ring-[var(--tech-border)]',
    },
    infra: {
      text: 'text-infra',
      textAccent: 'text-infra-accent',
      textForeground: 'text-infra-foreground',
      bg: 'bg-infra',
      bgSolid: 'bg-infra-solid',
      bgHover: 'bg-infra-hover',
      border: 'border-infra',
      gradient: 'gradient-infra',
      ring: 'ring-[var(--infra-border)]',
    },
    digital: {
      text: 'text-digital',
      textAccent: 'text-digital-accent',
      textForeground: 'text-digital-foreground',
      bg: 'bg-digital',
      bgSolid: 'bg-digital-solid',
      bgHover: 'bg-digital-hover',
      border: 'border-digital',
      gradient: 'gradient-digital',
      ring: 'ring-[var(--digital-border)]',
    },
  };
  return themes[theme];
};

export const getBaseColorClass = (color: 'primary' | 'secondary' | 'accent') => {
  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  };
  return colors[color];
};
