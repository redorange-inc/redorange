'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import { ui } from './constants';
import type { PrinciplesResponse } from './types';

interface PrinciplesSectionProps {
  principles: PrinciplesResponse['items'];
}

export const PrinciplesSection = ({ principles }: PrinciplesSectionProps) => {
  const solidPrinciples = principles.filter((p) => p.acronym.length === 1);
  const otherPrinciples = principles.filter((p) => p.acronym.length > 1);

  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Principios de Diseño</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fundamentos para código limpio y mantenible</p>
        </div>
        <Badge className="rounded-full bg-foreground text-background">SOLID</Badge>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Principios SOLID</h3>
        <div className="grid gap-4 md:grid-cols-5">
          {solidPrinciples.map((principle, idx) => (
            <Card key={idx} className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift} group`}>
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-tech flex items-center justify-center text-tech font-bold text-xl group-hover:scale-110 transition-transform">{principle.acronym}</div>
                <div className="text-xs font-semibold text-foreground mb-1">{principle.name}</div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Otros Principios</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {otherPrinciples.map((principle, idx) => (
            <Card key={idx} className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-tech-accent/20 p-3 text-tech">
                    <Icon name={principle.iconName} size="md" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-tech">{principle.acronym}</span>
                      <span className="text-sm font-semibold text-foreground">{principle.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{principle.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
