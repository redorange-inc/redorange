'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Wrench, ShieldCheck, Headphones, Settings } from 'lucide-react';
import { ui } from './constants';
import type { StatsResponse } from './types';

interface StatConfig {
  key: keyof StatsResponse;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
}

const statsConfig: StatConfig[] = [
  { key: 'projects', label: 'Proyectos ejecutados', icon: <Wrench className="h-4 w-4" /> },
  { key: 'clients', label: 'Clientes atendidos', icon: <ShieldCheck className="h-4 w-4" /> },
  { key: 'tickets', label: 'Tickets resueltos', icon: <Headphones className="h-4 w-4" /> },
  { key: 'uptime', label: 'Disponibilidad', suffix: '%', icon: <Settings className="h-4 w-4" /> },
];

interface OverviewCardProps {
  stats: StatsResponse;
}

export const OverviewCard = ({ stats }: OverviewCardProps) => {
  return (
    <Card className={`relative overflow-hidden rounded-3xl ${ui.glassCard}`} data-anim="fade-up">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-(--tech-gradient-from) blur-2xl animate-pulse" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-(--tech-accent)/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-foreground">Vista general</div>
            <div className="mt-1 text-xs text-muted-foreground">Capacidades y entregables</div>
          </div>
          <Badge className="rounded-full bg-foreground text-background transition-transform hover:scale-105">TI</Badge>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {statsConfig.map((s) => {
            const value = s.key === 'uptime' ? Number(stats[s.key]).toFixed(1) : Number(stats[s.key]).toLocaleString('es-MX');

            return (
              <div key={s.key} className={`rounded-2xl ${ui.softBorder} bg-background/40 p-3 backdrop-blur ${ui.hoverLift} group`}>
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-tech p-2 text-tech transition-all group-hover:scale-110 group-hover:rotate-3">{s.icon}</div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground tabular-nums">
                      {value}
                      {s.suffix ?? ''}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl bg-background/40 p-4 backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-tech" />
            Modalidad flexible
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Por proyecto, mensual o demanda según SLA. Cobertura adaptable a picos operativos.</p>
        </div>
      </CardContent>
    </Card>
  );
};
