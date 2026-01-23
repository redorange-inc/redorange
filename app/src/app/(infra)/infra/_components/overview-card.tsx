'use client';

import { Monitor, Building, Globe, Wrench, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StatsData } from './types';

interface OverviewCardProps {
  stats: StatsData;
}

const iconMap: Record<string, React.ElementType> = {
  monitor: Monitor,
  building: Building,
  globe: Globe,
  wrench: Wrench,
};

export const OverviewCard = ({ stats }: OverviewCardProps) => {
  return (
    <Card className="h-full border-infra/20 bg-linear-to-br from-infra/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading text-infra">Resumen de Operaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.items.map((stat, index) => {
          const IconComponent = iconMap[stat.iconName] || Monitor;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : null;

          return (
            <div key={index} className="flex items-center justify-between rounded-lg border border-infra/10 bg-background/50 p-3 transition-colors hover:bg-infra/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-infra/10">
                  <IconComponent className="h-5 w-5 text-infra" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-heading text-xl font-bold">{stat.value}</p>
                </div>
              </div>
              {stat.change && TrendIcon && (
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <TrendIcon className="h-4 w-4" />
                  {stat.change}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
