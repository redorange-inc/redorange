'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Icon } from './icon';
import { ui } from './constants';
import type { ServiceBenefit } from './types';

interface BenefitsStatsProps {
  benefits: ServiceBenefit[];
}

export const BenefitsStats = ({ benefits }: BenefitsStatsProps) => {
  return (
    <div data-anim="fade-up" className="grid gap-4 sm:grid-cols-3">
      {benefits.map((benefit, index) => (
        <Card key={index} className={`rounded-2xl ${ui.glassCard} text-center`}>
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-center mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-infra/20 text-infra">
                <Icon name={benefit.iconName} size="lg" />
              </div>
            </div>
            <p className="text-3xl font-bold text-infra">{benefit.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{benefit.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
