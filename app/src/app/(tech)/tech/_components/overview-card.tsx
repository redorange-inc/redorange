'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Wrench, ShieldCheck, Headphones, Settings } from 'lucide-react';
import { SkeletonStatCard, SkeletonPulse } from './skeletons';
import { ui } from './constants';
import { getStats } from '@/actions/tech/fn-get-stats';
import type { AnimatedMap, StatsResponse } from './types';

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

type Status = 'loading' | 'ready' | 'error';

export const OverviewCard = () => {
  const [status, setStatus] = useState<Status>('loading');
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);

  const [animatedValues, setAnimatedValues] = useState<AnimatedMap>({
    projects: 0,
    clients: 0,
    tickets: 0,
    uptime: 0,
  });

  const animationStarted = useRef(false);

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        setStatus('loading');

        const response = await getStats();

        // Validación defensiva (para no caer en "0" silencioso)
        if (!response?.data) {
          throw new Error('Respuesta inválida: no viene data');
        }

        if (!alive) return;

        setStatsData(response.data);
        setStatus('ready');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching stats:', error);
        if (!alive) return;

        setStatsData(null);
        setStatus('error');
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (status !== 'ready' || !statsData || animationStarted.current) return;
    animationStarted.current = true;

    statsConfig.forEach((s) => {
      const targetValue = statsData[s.key];

      // Por seguridad (si viniera undefined)
      if (typeof targetValue !== 'number') return;

      const obj = { v: 0 };
      animate(obj, {
        v: targetValue,
        duration: 1800,
        easing: 'easeOutExpo',
        delay: 200,
        update: () => {
          setAnimatedValues((prev) => ({
            ...prev,
            [s.key]: s.key === 'uptime' ? Number(obj.v.toFixed(1)) : Math.round(obj.v),
          }));
        },
      });
    });
  }, [status, statsData]);

  const isLoading = status === 'loading';

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
          {isLoading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : status === 'error' ? (
            <div className="col-span-2 rounded-2xl border border-border/50 bg-background/40 p-4 text-sm text-muted-foreground backdrop-blur">
              No se pudieron cargar las métricas. Revisa consola/Server Actions o intenta recargar.
            </div>
          ) : (
            statsConfig.map((s) => (
              <div key={s.key} className={`rounded-2xl ${ui.softBorder} bg-background/40 p-3 backdrop-blur ${ui.hoverLift} group`}>
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-tech p-2 text-tech transition-all group-hover:scale-110 group-hover:rotate-3">{s.icon}</div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground tabular-nums">
                      {animatedValues[s.key]}
                      {s.suffix ?? ''}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl bg-background/40 p-4 backdrop-blur">
          {isLoading ? (
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-32" />
              <SkeletonPulse className="h-3 w-full" />
              <SkeletonPulse className="h-3 w-4/5" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-tech" />
                Modalidad flexible
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Por proyecto, mensual o demanda según SLA. Cobertura adaptable a picos operativos.</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
