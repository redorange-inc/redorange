import type { ReactNode } from 'react';

export interface Stat {
  key: 'projects' | 'clients' | 'tickets' | 'uptime';
  label: string;
  value: number;
  suffix?: string;
  helper?: string;
  icon: ReactNode;
}

export interface ImpactRow {
  area: string;
  value: number;
  [key: string]: string | number;
}

export interface Achievement {
  title: string;
  description: string;
  metric: string;
  icon: ReactNode;
}

export interface TimeSeriesData {
  month: string;
  rendimiento: number;
  satisfaccion: number;
}

export interface ServiceItem {
  text: string;
  icon: ReactNode;
}

export interface Highlight {
  title: string;
  desc: string;
  icon: ReactNode;
}

export type AnimatedMap = Record<string, number>;

export interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    value?: number | string;
    name?: string;
    dataKey?: string;
    color?: string;
  }>;
}

export interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    name?: string;
    payload?: {
      area?: string;
      value?: number;
    };
  }>;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    source: string;
  };
  message?: string;
}

export interface StatsResponse {
  projects: number;
  clients: number;
  tickets: number;
  uptime: number;
}

export interface ImpactDataResponse {
  items: Array<{
    area: string;
    value: number;
  }>;
}

export interface TimeSeriesResponse {
  items: Array<{
    month: string;
    rendimiento: number;
    satisfaccion: number;
  }>;
}

export interface ServiceItemResponse {
  items: Array<{
    text: string;
    iconName: string;
  }>;
}

export interface AchievementResponse {
  items: Array<{
    title: string;
    description: string;
    metric: string;
    iconName: string;
  }>;
}

export interface HighlightResponse {
  items: Array<{
    title: string;
    desc: string;
    iconName: string;
  }>;
}
