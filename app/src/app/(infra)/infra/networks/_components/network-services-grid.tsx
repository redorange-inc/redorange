'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from './icon';
import { ui } from './constants';
import type { NetworkService } from './types';

interface NetworkServicesGridProps {
  services: NetworkService[];
}

export const NetworkServicesGrid = ({ services }: NetworkServicesGridProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Nuestros Servicios</h2>
        <p className="mt-1 text-sm text-muted-foreground">Soluciones completas de conectividad</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift} group`}>
            <CardHeader className="pb-3">
              <div className="rounded-2xl bg-infra/20 p-3 text-infra w-fit group-hover:scale-110 transition-transform">
                <Icon name={service.iconName} size="lg" />
              </div>
              <CardTitle className="text-lg mt-3">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, index) => (
                  <span key={index} className="inline-flex items-center gap-1 rounded-full bg-infra/10 border border-infra/20 px-2.5 py-0.5 text-xs">
                    <Icon name="check" size="sm" className="text-infra" />
                    {feature}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
