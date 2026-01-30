'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Icon } from './icon';
import { ui } from './constants';
import type { QuoteBenefit } from './types';

interface BenefitsSectionProps {
  benefits: QuoteBenefit[];
}

export const BenefitsSection = ({ benefits }: BenefitsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">¿Por qué cotizar con nosotros?</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <Card key={index} className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift} group`}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-infra/20 text-infra group-hover:scale-110 transition-transform">
                <Icon name={benefit.iconName} size="md" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold leading-tight text-foreground">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
