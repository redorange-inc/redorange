'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { SkeletonChart } from './skeletons';
import { ui, TECH, TECH_ACCENT } from './constants';
import { CustomTooltip } from './chart-tooltips';
import { getTimeSeries } from '@/actions/tech/fn-get-time-series';
import type { TimeSeriesData, CustomTooltipProps } from './types';

export const TrendChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [timeSeriesDataFinal, setTimeSeriesDataFinal] = useState<TimeSeriesData[]>([]);
  const animationStarted = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTimeSeries();
        setTimeSeriesDataFinal(response.data.items);
        setTimeSeriesData(response.data.items.map((d) => ({ ...d, rendimiento: 0, satisfaccion: 0 })));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching time series:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading || timeSeriesDataFinal.length === 0 || animationStarted.current) return;
    animationStarted.current = true;

    timeSeriesDataFinal.forEach((row, idx) => {
      const obj = { r: 0, s: 0 };
      animate(obj, {
        r: row.rendimiento,
        s: row.satisfaccion,
        duration: 2500,
        easing: 'easeOutQuart',
        delay: 600 + idx * 60,
        update: () => {
          setTimeSeriesData((prev) => {
            const newData = [...prev];
            newData[idx] = { month: row.month, rendimiento: Math.round(obj.r), satisfaccion: Math.round(obj.s) };
            return newData;
          });
        },
      });
    });
  }, [isLoading, timeSeriesDataFinal]);

  return (
    <Card className={`rounded-3xl lg:col-span-6 ${ui.glassCard}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <Activity className="h-5 w-5 text-tech-accent" />
          Tendencia anual
        </CardTitle>
        <CardDescription className="text-sm">Evolución de métricas clave 2026</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonChart />
        ) : (
          <div className="h-[300px] min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                <defs>
                  <linearGradient id="rendimientoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TECH} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={TECH} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="satisfaccionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TECH_ACCENT} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={TECH_ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-border" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis tickLine={false} axisLine={false} width={35} className="text-xs" tick={{ fill: 'currentColor' }} domain={[0, 100]} />
                <ReTooltip content={(props) => <CustomTooltip {...(props as unknown as CustomTooltipProps)} />} />

                <Area type="monotone" dataKey="rendimiento" name="Rendimiento" stroke={TECH} strokeWidth={2} fill="url(#rendimientoGrad)" />
                <Area type="monotone" dataKey="satisfaccion" name="Satisfacción" stroke={TECH_ACCENT} strokeWidth={2} fill="url(#satisfaccionGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {!isLoading && (
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: TECH }} />
              <span className="text-xs text-muted-foreground">Rendimiento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: TECH_ACCENT }} />
              <span className="text-xs text-muted-foreground">Satisfacción</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
