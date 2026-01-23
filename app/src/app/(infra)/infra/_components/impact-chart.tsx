'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { ImpactData } from './types';

interface ImpactChartProps {
  impactData: ImpactData;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-background/95 backdrop-blur p-3 shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export const ImpactChart = ({ impactData }: ImpactChartProps) => {
  return (
    <Card className="lg:col-span-5 border-infra/20 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-infra" />
          <div>
            <CardTitle className="text-base font-heading">{impactData.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{impactData.subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={impactData.items} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name">
                {impactData.items.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
          {impactData.items.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
