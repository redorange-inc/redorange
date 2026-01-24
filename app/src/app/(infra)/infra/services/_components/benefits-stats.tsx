'use client';

import { Clock, Award, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ServiceBenefit } from './types';

interface BenefitsStatsProps {
  benefits: ServiceBenefit[];
}

const iconMap: Record<string, React.ElementType> = {
  clock: Clock,
  award: Award,
  thumbsUp: ThumbsUp,
};

export const BenefitsStats = ({ benefits }: BenefitsStatsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {benefits.map((benefit, index) => {
        const IconComponent = iconMap[benefit.iconName] || Clock;

        return (
          <Card
            key={index}
            className="border-infra/20 bg-card/60 backdrop-blur-md text-center"
          >
            <CardContent className="pt-6 pb-4">
              <div className="flex justify-center mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-infra/10">
                  <IconComponent className="h-6 w-6 text-infra" />
                </div>
              </div>
              <p className="font-heading text-3xl font-bold text-infra">{benefit.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{benefit.title}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
