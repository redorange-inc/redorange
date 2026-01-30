'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Icon } from './icon';
import { ui } from './constants';
import type { NetworkBenefit } from './types';

interface NetworkBenefitsProps {
  benefits: NetworkBenefit[];
}

export const NetworkBenefits = ({ benefits }: NetworkBenefitsProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">¿Por qué elegirnos?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ventajas de trabajar con nosotros</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => (
          <Card key={index} className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift} group`}>
            <CardContent className="p-5 text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-infra/20 flex items-center justify-center text-infra group-hover:scale-110 transition-transform">
                <Icon name={benefit.iconName} size="lg" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{benefit.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
