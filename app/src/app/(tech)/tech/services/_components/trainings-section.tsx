'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import { ui, levelColors } from './constants';
import type { TrainingsResponse } from './types';

interface TrainingsSectionProps {
  trainings: TrainingsResponse['items'];
}

export const TrainingsSection = ({ trainings }: TrainingsSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Capacitación</h2>
          <p className="mt-1 text-sm text-muted-foreground">Programas de formación en herramientas informáticas</p>
        </div>
        <Badge className="rounded-full bg-background/60 text-foreground backdrop-blur">
          <Icon name="graduation-cap" size="sm" className="mr-1" />
          Training
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trainings.map((training, idx) => (
          <Card key={idx} className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift} group`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-xl bg-tech/20 p-2.5 text-tech group-hover:scale-110 transition-transform">
                  <Icon name={training.iconName} size="md" />
                </div>
                <Badge className={`rounded-full text-[10px] ${levelColors[training.level]}`}>{training.level.charAt(0).toUpperCase() + training.level.slice(1)}</Badge>
              </div>

              <h4 className="text-sm font-semibold text-foreground mb-1">{training.title}</h4>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{training.description}</p>

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Icon name="clock" size="sm" />
                <span>Duración: {training.duration}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
