'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import { ui } from './constants';
import type { TechnicalService } from './types';

interface ServicesGridProps {
  services: TechnicalService[];
}

export const ServicesGrid = ({ services }: ServicesGridProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Nuestros Servicios</h2>
        <p className="mt-1 text-sm text-muted-foreground">Soluciones técnicas profesionales</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift} group`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-infra/20 p-3 text-infra group-hover:scale-110 transition-transform">
                  <Icon name={service.iconName} size="lg" />
                </div>
                {service.price && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{service.price}</Badge>}
              </div>
              <CardTitle className="text-lg mt-3">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <ul className="space-y-1.5">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Icon name="check" size="sm" className="text-infra shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
