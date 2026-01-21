import { Server, Database, Code2, Shield, HardDrive, Key, Layers, Box, Cpu, Cloud, GitBranch, Terminal, FileCode, Settings, Zap, Lock, Globe, Rocket, Workflow, Container } from 'lucide-react';
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
    Server: <Server className={sizeClass} />,
    Database: <Database className={sizeClass} />,
    Code2: <Code2 className={sizeClass} />,
    Shield: <Shield className={sizeClass} />,
    HardDrive: <HardDrive className={sizeClass} />,
    Key: <Key className={sizeClass} />,
    Layers: <Layers className={sizeClass} />,
    Box: <Box className={sizeClass} />,
    Cpu: <Cpu className={sizeClass} />,
    Cloud: <Cloud className={sizeClass} />,
    GitBranch: <GitBranch className={sizeClass} />,
    Terminal: <Terminal className={sizeClass} />,
    FileCode: <FileCode className={sizeClass} />,
    Settings: <Settings className={sizeClass} />,
    Zap: <Zap className={sizeClass} />,
    Lock: <Lock className={sizeClass} />,
    Globe: <Globe className={sizeClass} />,
    Rocket: <Rocket className={sizeClass} />,
    Workflow: <Workflow className={sizeClass} />,
    Container: <Container className={sizeClass} />,
  };

  return icons[iconName] || null;
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
