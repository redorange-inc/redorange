import { Clock, Zap, Users, Monitor, HardDrive, Workflow, BookOpen, Lightbulb, Target, CheckCircle } from 'lucide-react';
import { Code2, Server, Database, Network, Headphones, FileText, TrendingUp, GraduationCap, Settings, Shield } from 'lucide-react';
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
    Code2: <Code2 className={sizeClass} />,
    Server: <Server className={sizeClass} />,
    Database: <Database className={sizeClass} />,
    Network: <Network className={sizeClass} />,
    Headphones: <Headphones className={sizeClass} />,
    FileText: <FileText className={sizeClass} />,
    TrendingUp: <TrendingUp className={sizeClass} />,
    GraduationCap: <GraduationCap className={sizeClass} />,
    Settings: <Settings className={sizeClass} />,
    Shield: <Shield className={sizeClass} />,
    Clock: <Clock className={sizeClass} />,
    Zap: <Zap className={sizeClass} />,
    Users: <Users className={sizeClass} />,
    Monitor: <Monitor className={sizeClass} />,
    HardDrive: <HardDrive className={sizeClass} />,
    Workflow: <Workflow className={sizeClass} />,
    BookOpen: <BookOpen className={sizeClass} />,
    Lightbulb: <Lightbulb className={sizeClass} />,
    Target: <Target className={sizeClass} />,
    CheckCircle: <CheckCircle className={sizeClass} />,
  };

  return icons[iconName] || null;
};

export const levelColors: Record<string, string> = {
  básico: 'bg-green-500/20 text-green-400',
  intermedio: 'bg-yellow-500/20 text-yellow-400',
  avanzado: 'bg-red-500/20 text-red-400',
};
