import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Headphones, Shield, Zap, Code2, Server, Database, Settings, CheckCircle, ArrowRight, Building, Globe } from 'lucide-react';
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
    Mail: <Mail className={sizeClass} />,
    Phone: <Phone className={sizeClass} />,
    MapPin: <MapPin className={sizeClass} />,
    Clock: <Clock className={sizeClass} />,
    MessageCircle: <MessageCircle className={sizeClass} />,
    Send: <Send className={sizeClass} />,
    Headphones: <Headphones className={sizeClass} />,
    Shield: <Shield className={sizeClass} />,
    Zap: <Zap className={sizeClass} />,
    Code2: <Code2 className={sizeClass} />,
    Server: <Server className={sizeClass} />,
    Database: <Database className={sizeClass} />,
    Settings: <Settings className={sizeClass} />,
    CheckCircle: <CheckCircle className={sizeClass} />,
    ArrowRight: <ArrowRight className={sizeClass} />,
    Building: <Building className={sizeClass} />,
    Globe: <Globe className={sizeClass} />,
  };

  return icons[iconName] || null;
};
