'use client';

import { Zap, Globe, Shield, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ContactFeature } from './types';

interface FeaturesSectionProps {
  features: ContactFeature[];
}

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  globe: Globe,
  shield: Shield,
  headphones: Headphones,
};

export const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  return (
    <section className="py-10">
      <h2 className="font-heading text-2xl font-bold mb-6">¿Por qué contactarnos?</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const IconComponent = iconMap[feature.iconName] || Zap;

          return (
            <Card key={index} className="border-infra/20 bg-card/60 backdrop-blur-md transition-all hover:border-infra/40 hover:shadow-md group">
              <CardContent className="p-5">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-infra/10 group-hover:bg-infra/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-infra" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
