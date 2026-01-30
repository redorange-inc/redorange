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

const cardFxGlow =
  'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 ' +
  'backdrop-blur-md shadow-sm transition-all duration-300 ' +
  'hover:-translate-y-0.5 hover:shadow-md ' +
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:p-[1px] ' +
  'before:bg-linear-to-br before:from-infra/20 before:via-transparent before:to-infra-muted/20 before:opacity-0 ' +
  'before:transition-opacity before:duration-300 hover:before:opacity-100';

export const BenefitsSection = ({ benefits }: BenefitsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-bold">¿Por qué cotizar con nosotros?</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => {
          const IconComponent = iconMap[benefit.iconName] || Clock;

          return (
            <Card key={index} className={cardFxGlow}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-infra/10">
                  <IconComponent className="h-5 w-5 text-infra" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold leading-tight">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
