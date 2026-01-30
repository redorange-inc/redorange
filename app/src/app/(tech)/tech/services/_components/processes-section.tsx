'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import { ui } from './constants';
import type { ProcessesResponse } from './types';

interface ProcessesSectionProps {
  processes: ProcessesResponse['items'];
}

export const ProcessesSection = ({ processes }: ProcessesSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mejora de Procesos</h2>
          <p className="mt-1 text-sm text-muted-foreground">Optimización y estandarización organizacional</p>
        </div>
        <Badge className="rounded-full bg-foreground text-background">BPM</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {processes.map((process, idx) => (
          <Card key={idx} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-tech p-3 text-tech">
                  <Icon name={process.iconName} size="lg" />
                </div>
                <CardTitle className="text-lg">{process.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{process.description}</p>

              <div className="space-y-2">
                {process.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-tech/20 text-tech text-[10px] font-bold shrink-0">{i + 1}</div>
                    <span className="text-foreground">{step}</span>
                    {i < process.steps.length - 1 && <Icon name="arrow-right" size="sm" className="text-muted-foreground/50 ml-auto" />}
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
