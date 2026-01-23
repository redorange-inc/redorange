'use client';

import { Monitor, Building, Globe, Wrench, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <Card className="h-full border-infra/20 bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-heading">{stats.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{stats.subtitle}</p>
          </div>
          <Badge className="bg-infra/10 text-infra border-infra/20 font-heading">IF</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {stats.items.map((stat, index) => {
            const IconComponent = iconMap[stat.iconName] || Monitor;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : null;

            return (
              <div key={index} className="flex items-center gap-3 rounded-lg border border-infra/10 bg-background/40 backdrop-blur-sm p-3 transition-colors hover:bg-infra/5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-infra/10">
                  <IconComponent className="h-4 w-4 text-infra" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-lg font-bold">{stat.value}</span>
                    {stat.change && TrendIcon && (
                      <span className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <TrendIcon className="h-3 w-3 mr-0.5" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {stats.flexibility && (
          <div className="rounded-lg border border-infra/10 bg-infra/5 backdrop-blur-sm p-3">
            <div className="flex items-start gap-2">
              <Settings className="h-4 w-4 text-infra mt-0.5" />
              <div>
                <p className="font-medium text-sm">{stats.flexibility.title}</p>
                <p className="text-xs text-muted-foreground">{stats.flexibility.description}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
