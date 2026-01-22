'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { ui, getIcon } from './constants';
import type { SupportLevelsResponse } from './types';

interface SupportLevelsSectionProps {
  supportLevels: SupportLevelsResponse['items'];
}

export const SupportLevelsSection = ({ supportLevels }: SupportLevelsSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Niveles de Soporte</h2>
          <p className="mt-1 text-sm text-muted-foreground">SLA según criticidad del incidente</p>
        </div>
        <Badge className="rounded-full bg-tech-solid">SLA</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {supportLevels.map((level, idx) => (
          <Card key={idx} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift} relative overflow-hidden`}>
            {idx === 2 && <div className="absolute top-0 right-0 bg-tech text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">Recomendado</div>}
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-tech p-3 text-tech">{getIcon(level.iconName, 'lg')}</div>
                <div>
                  <CardTitle className="text-lg">{level.name}</CardTitle>
                  <Badge className="mt-1 rounded-full bg-tech/20 text-tech text-[10px]">Respuesta: {level.responseTime}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{level.description}</p>

              <div className="space-y-2">
                {level.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 text-tech shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
