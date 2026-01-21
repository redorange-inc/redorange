import { GitBranch, Layers, Target, Zap, RefreshCw, Users, CheckCircle, Code2, Boxes, Workflow, Puzzle, ArrowRight, Shield, Cpu, FileCode, Settings } from 'lucide-react';
import type { ReactNode } from 'react';

export const TECH = '#06b6d4';
export const TECH_ACCENT = '#0891b2';

export const ui = {
  glassCard: 'border-border/40 bg-background/40 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.25)] backdrop-blur-xl',
  softBorder: 'border border-border/50',
  hoverLift: 'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(6,182,212,0.4)]',
};

export const getIcon = (iconName: string, size: 'sm' | 'md' | 'lg' = 'md'): ReactNode => {
  const sizeMap = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
  const sizeClass = sizeMap[size];

  const icons: Record<string, ReactNode> = {
    GitBranch: <GitBranch className={sizeClass} />,
    Layers: <Layers className={sizeClass} />,
    Target: <Target className={sizeClass} />,
    Zap: <Zap className={sizeClass} />,
    RefreshCw: <RefreshCw className={sizeClass} />,
    Users: <Users className={sizeClass} />,
    CheckCircle: <CheckCircle className={sizeClass} />,
    Code2: <Code2 className={sizeClass} />,
    Boxes: <Boxes className={sizeClass} />,
    Workflow: <Workflow className={sizeClass} />,
    Puzzle: <Puzzle className={sizeClass} />,
    ArrowRight: <ArrowRight className={sizeClass} />,
    Shield: <Shield className={sizeClass} />,
    Cpu: <Cpu className={sizeClass} />,
    FileCode: <FileCode className={sizeClass} />,
    Settings: <Settings className={sizeClass} />,
  };

  return icons[iconName] || null;
};
