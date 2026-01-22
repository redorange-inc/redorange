import { Code2, Database, Server, Settings, Activity, ShieldCheck, Headphones, Zap, Clock, Award, Wrench } from 'lucide-react';
import type { ReactNode } from 'react';

export const TECH = '#06b6d4';
export const TECH_ACCENT = '#0891b2';

export const PIE_COLORS = ['#06b6d4', '#22d3ee', '#67e8f9', '#0891b2', '#0e7490', '#a5f3fc'];

export const ui = {
  glassCard: 'border-border/40 bg-background/40 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.25)] backdrop-blur-xl',
  softBorder: 'border border-border/50',
  hoverLift: 'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(6,182,212,0.4)]',
};

export const getIcon = (iconName: string, size: 'sm' | 'md' = 'md'): ReactNode => {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const icons: Record<string, ReactNode> = {
    Code2: <Code2 className={sizeClass} />,
    Database: <Database className={sizeClass} />,
    Server: <Server className={sizeClass} />,
    Settings: <Settings className={sizeClass} />,
    Activity: <Activity className={sizeClass} />,
    ShieldCheck: <ShieldCheck className={sizeClass} />,
    Headphones: <Headphones className={sizeClass} />,
    Zap: <Zap className={sizeClass} />,
    Clock: <Clock className={sizeClass} />,
    Award: <Award className={sizeClass} />,
    Wrench: <Wrench className={sizeClass} />,
  };

  return icons[iconName] || null;
};
