'use client';

import { Cable, Wifi, Router, Activity, Headphones, Server, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NetworkService } from './types';

interface NetworkServicesGridProps {
  services: NetworkService[];
}

const iconMap: Record<string, React.ElementType> = {
  cable: Cable,
  wifi: Wifi,
  router: Router,
  activity: Activity,
  headphones: Headphones,
  server: Server,
};

export const NetworkServicesGrid = ({ services }: NetworkServicesGridProps) => {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">Nuestros Servicios</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const IconComponent = iconMap[service.iconName] || Cable;

          return (
            <Card
              key={service.id}
              className="border-infra/20 bg-card/60 backdrop-blur-md transition-all hover:border-infra/40 hover:shadow-lg group"
            >
              <CardHeader className="pb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-infra/10 group-hover:bg-infra/20 transition-colors">
                  <IconComponent className="h-6 w-6 text-infra" />
                </div>
                <CardTitle className="text-lg mt-3">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-infra/5 border border-infra/20 px-2.5 py-0.5 text-xs"
                    >
                      <Check className="h-3 w-3 text-infra" />
                      {feature}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
