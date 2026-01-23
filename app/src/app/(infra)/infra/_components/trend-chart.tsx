'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import type { TimeSeriesData } from './types';

interface TrendChartProps {
  timeSeriesData: TimeSeriesData;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-background/95 backdrop-blur p-3 shadow-lg">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TrendChart = ({ timeSeriesData }: TrendChartProps) => {
  return (
    <Card className="lg:col-span-7 border-infra/20 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-infra" />
          <div>
            <CardTitle className="text-base font-heading">{timeSeriesData.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{timeSeriesData.subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData.items} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorImportaciones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ventas" name="Ventas" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorVentas)" />
              <Area type="monotone" dataKey="importaciones" name="Importaciones" stroke="#fb7185" strokeWidth={2} fillOpacity={1} fill="url(#colorImportaciones)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f43f5e]" />
            <span className="text-muted-foreground">Ventas</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
            <span className="text-muted-foreground">Importaciones</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
