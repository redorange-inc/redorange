'use client';

import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PieCustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType> & { payload?: any[] }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0];

  return (
    <div className="rounded-xl border border-infra/20 bg-card/95 backdrop-blur-md px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-foreground">{data.name}</p>
      <p className="text-xs text-infra font-semibold">{data.value}%</p>
    </div>
  );
};
