'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Icon } from './icon';
import { ui } from './constants';
import type { ContactFeature } from './types';

interface FeaturesSectionProps {
  features: ContactFeature[];
}

export const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  return (
    <section data-anim="fade-up">
      <h2 className="text-xl font-bold text-foreground mb-4">¿Por qué contactarnos?</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, idx) => (
          <Card key={idx} className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift} group`}>
            <CardContent className="p-5 text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-infra/20 flex items-center justify-center text-infra group-hover:scale-110 transition-transform">
                <Icon name={feature.iconName} size="lg" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
