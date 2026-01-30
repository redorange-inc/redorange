'use client';

import { Monitor, Building, Globe, Wrench, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StatsData } from './types';
import { ui } from './constants';

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
    <Card className={`relative overflow-hidden rounded-3xl ${ui.glassCard}`} data-anim="fade-up">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-infra/30 blur-2xl animate-pulse" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-infra-accent/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-foreground">{stats.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stats.subtitle}</div>
          </div>
          <Badge className="rounded-full bg-foreground text-background transition-transform hover:scale-105">IF</Badge>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {stats.items.map((stat, index) => {
            const IconComponent = iconMap[stat.iconName] || Monitor;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : null;

            return (
              <div key={index} className={`rounded-2xl ${ui.softBorder} bg-background/40 p-3 backdrop-blur ${ui.hoverLift} group`}>
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-infra/10 p-2 text-infra transition-all group-hover:scale-110 group-hover:rotate-3">
                    <IconComponent className="h-4 w-4" />
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-lg font-bold text-foreground tabular-nums">{stat.value}</span>
                      {stat.change && TrendIcon && (
                        <span className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          <TrendIcon className="h-3 w-3" />
                          {stat.change}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {stats.flexibility && (
          <div className="mt-5 overflow-hidden rounded-2xl bg-background/40 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-infra" />
              {stats.flexibility.title}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{stats.flexibility.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
