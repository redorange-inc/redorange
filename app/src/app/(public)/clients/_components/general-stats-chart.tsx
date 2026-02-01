'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from './icon';
import { SERVICE_HEX_COLORS, SERVICE_TYPE_LABELS, ui } from './constants';
import type { ClientStats } from '@/actions/fn-clients';

interface GeneralStatsChartProps {
  stats: ClientStats;
}

export const GeneralStatsChart = ({ stats }: GeneralStatsChartProps) => {
  const pieData = useMemo(() => {
    return stats.byService.map((s) => ({
      name: s.label,
      value: s.count,
      color: SERVICE_HEX_COLORS[s.service as keyof typeof SERVICE_HEX_COLORS] || s.color,
    }));
  }, [stats.byService]);

  const barData = useMemo(() => {
    return stats.byCategory.map((cat) => ({
      name: cat.label,
      shortName: cat.label.replace('Entidades ', '').replace('Otros ', ''),
      tech: cat.serviceBreakdown.find((s) => s.service === 'tech')?.count || 0,
      infra: cat.serviceBreakdown.find((s) => s.service === 'infra')?.count || 0,
      digital: cat.serviceBreakdown.find((s) => s.service === 'digital')?.count || 0,
    }));
  }, [stats.byCategory]);

  return (
    <section data-anim="fade-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Análisis General</h2>
        <p className="mt-1 text-sm text-muted-foreground">Distribución de clientes por línea de servicio y categoría</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className={`rounded-2xl ${ui.glassCard} lg:col-span-2`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="pie-chart" size="sm" className="text-primary" />
              Por Línea de Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {stats.byService.map((service) => (
                <div key={service.service} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SERVICE_HEX_COLORS[service.service as keyof typeof SERVICE_HEX_COLORS] }} />
                    <span className="text-muted-foreground">{service.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{service.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`rounded-2xl ${ui.glassCard} lg:col-span-3`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="bar-chart-3" size="sm" className="text-primary" />
              Servicios por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                  <XAxis dataKey="shortName" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} interval={0} angle={0} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} domain={[0, 'auto']} width={30} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                  <Bar dataKey="tech" name={SERVICE_TYPE_LABELS.tech} fill={SERVICE_HEX_COLORS.tech} radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="infra" name={SERVICE_TYPE_LABELS.infra} fill={SERVICE_HEX_COLORS.infra} radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="digital" name={SERVICE_TYPE_LABELS.digital} fill={SERVICE_HEX_COLORS.digital} radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-4 mt-2 justify-center border-t border-border/50 pt-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-sm bg-tech-muted" />
                <span className="text-muted-foreground">{SERVICE_TYPE_LABELS.tech}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-sm bg-infra-muted" />
                <span className="text-muted-foreground">{SERVICE_TYPE_LABELS.infra}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-sm bg-digital-muted" />
                <span className="text-muted-foreground">{SERVICE_TYPE_LABELS.digital}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
