'use client';

import { Signal, TrendingUp, Shield, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { NetworkBenefit } from './types';

interface NetworkBenefitsProps {
  benefits: NetworkBenefit[];
}

const iconMap: Record<string, React.ElementType> = {
  signal: Signal,
  trendingUp: TrendingUp,
  shield: Shield,
  headphones: Headphones,
};

export const NetworkBenefits = ({ benefits }: NetworkBenefitsProps) => {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">¿Por qué elegirnos?</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => {
          const IconComponent = iconMap[benefit.iconName] || Signal;

          return (
            <Card key={index} className="border-infra/20 bg-card/60 backdrop-blur-md transition-all hover:border-infra/40 group">
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-infra/10 group-hover:bg-infra/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-infra" />
                  </div>
                </div>
                <h3 className="font-heading font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
