'use client';

import { Clock, Tag, Headphones, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { QuoteBenefit } from './types';

interface BenefitsSectionProps {
  benefits: QuoteBenefit[];
}

const iconMap: Record<string, React.ElementType> = {
  clock: Clock,
  tag: Tag,
  headphones: Headphones,
  shield: Shield,
};

export const BenefitsSection = ({ benefits }: BenefitsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-bold">¿Por qué cotizar con nosotros?</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => {
          const IconComponent = iconMap[benefit.iconName] || Clock;

          return (
            <Card
              key={index}
              className="border-infra/20 bg-card/60 backdrop-blur-md transition-all hover:border-infra/40"
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-infra/10">
                  <IconComponent className="h-5 w-5 text-infra" />
                </div>
                <div>
                  <h3 className="font-medium">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
