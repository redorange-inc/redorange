'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { PieCustomTooltip } from './chart-tooltips';
import type { ImpactData } from './types';

interface ImpactChartProps {
  impactData: ImpactData;
}

const PIE_COLORS = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'];

interface ImpactRow {
  area: string;
  value: number;
}

export const ImpactChart = ({ impactData }: ImpactChartProps) => {
  const data = useMemo<ImpactRow[]>(() => (impactData.items ?? []).map((d) => ({ area: d.name, value: Number(d.value ?? 0) })), [impactData.items]);

  return (
    <Card className="rounded-3xl border-infra/20 bg-card/60 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <TrendingUp className="h-5 w-5 text-infra" />
          {impactData.title}
        </CardTitle>
        <CardDescription className="text-sm">{impactData.subtitle}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] min-h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {PIE_COLORS.map((color, index) => (
                  <linearGradient key={`gradient-${index}`} id={`pieGradientInfra-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>

              <Pie
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={data as any}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="area"
                stroke="none"
                labelLine={false}
                label={(props) => {
                  const { cx, cy, midAngle, outerRadius, payload } = props as {
                    cx: number;
                    cy: number;
                    midAngle: number;
                    outerRadius: number;
                    payload: ImpactRow;
                  };

                  const RADIAN = Math.PI / 180;
                  const radius = (outerRadius ?? 100) + 25;
                  const angle = midAngle ?? 0;

                  const x = (cx ?? 0) + radius * Math.cos(-angle * RADIAN);
                  const y = (cy ?? 0) + radius * Math.sin(-angle * RADIAN);

                  return (
                    <text x={x} y={y} fill="currentColor" className="text-[10px] fill-muted-foreground" textAnchor={x > (cx ?? 0) ? 'start' : 'end'} dominantBaseline="central">
                      {payload.area} ({payload.value}%)
                    </text>
                  );
                }}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGradientInfra-${index})`} className="transition-all duration-300 hover:opacity-80" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }} />
                ))}
              </Pie>

              <ReTooltip content={<PieCustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {data.map((item, idx) => (
            <div key={item.area} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
              <span className="text-[10px] text-muted-foreground">{item.area}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
