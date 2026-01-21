'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { CustomTooltipProps, PieTooltipProps } from './types';

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <Card className="border-(--tech-border) bg-background/95 shadow-2xl backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="text-sm font-bold text-foreground mb-2">{String(label ?? '')}</div>
        <div className="space-y-1.5">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-bold text-foreground">{String(entry.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const PieCustomTooltip = ({ active, payload }: PieTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  return (
    <Card className="border-(--tech-border) bg-background/95 shadow-2xl backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="text-sm font-bold text-foreground mb-1">{data.payload?.area}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Impacto:</span>
          <span className="font-bold text-tech">{data.payload?.value}%</span>
        </div>
      </CardContent>
    </Card>
  );
};
