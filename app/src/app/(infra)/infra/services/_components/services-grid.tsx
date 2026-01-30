'use client';

import { Search, Wrench, Settings, Monitor, Headphones, HardDrive, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TechnicalService } from './types';

interface ServicesGridProps {
  services: TechnicalService[];
}

const iconMap: Record<string, React.ElementType> = {
  search: Search,
  wrench: Wrench,
  settings: Settings,
  monitor: Monitor,
  headphones: Headphones,
  hardDrive: HardDrive,
};

export const ServicesGrid = ({ services }: ServicesGridProps) => {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">Nuestros Servicios</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const IconComponent = iconMap[service.iconName] || Wrench;

          return (
            <Card key={service.id} className="border-infra/20 bg-card/60 backdrop-blur-md transition-all hover:border-infra/40 hover:shadow-lg group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-infra/10 group-hover:bg-infra/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-infra" />
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
                      <Check className="h-3.5 w-3.5 text-infra shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
