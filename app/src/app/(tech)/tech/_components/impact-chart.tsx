'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { SkeletonChart } from './skeletons';
import { ui, PIE_COLORS } from './constants';
import { PieCustomTooltip } from './chart-tooltips';
import { getImpactData } from '@/actions/tech/fn-get-impact-data';
import type { ImpactRow } from './types';

export const ImpactChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [impactData, setImpactData] = useState<ImpactRow[]>([]);
  const [impactDataFinal, setImpactDataFinal] = useState<ImpactRow[]>([]);
  const animationStarted = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getImpactData();
        setImpactDataFinal(response.data.items);
        setImpactData(response.data.items.map((d) => ({ ...d, value: 0 })));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching impact data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading || impactDataFinal.length === 0 || animationStarted.current) return;
    animationStarted.current = true;

    impactDataFinal.forEach((row, idx) => {
      const obj = { v: 0 };
      animate(obj, {
        v: row.value,
        duration: 2000,
        easing: 'easeOutQuart',
        delay: 400 + idx * 80,
        update: () => {
          setImpactData((prev) => {
            const newData = [...prev];
            newData[idx] = { area: row.area, value: Math.round(obj.v) };
            return newData;
          });
        },
      });
    });
  }, [isLoading, impactDataFinal]);

  return (
    <Card className={`rounded-3xl lg:col-span-6 ${ui.glassCard}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <TrendingUp className="h-5 w-5 text-tech" />
          Impacto por área
        </CardTitle>
        <CardDescription className="text-sm">Resultados medibles en cada especialidad</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonChart />
        ) : (
          <div className="h-[300px] min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {PIE_COLORS.map((color, index) => (
                    <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={impactData}
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
                  {impactData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#pieGradient-${index})`} className="transition-all duration-300 hover:opacity-80" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }} />
                  ))}
                </Pie>
                <ReTooltip content={<PieCustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {!isLoading && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {impactData.map((item, idx) => (
              <div key={item.area} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                <span className="text-[10px] text-muted-foreground">{item.area}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
