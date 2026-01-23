'use client';

import Link from 'next/link';
import { Wrench, Settings, Monitor, Shield, Network, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TechnicalServicesData, ServiceItem } from './types';

interface TechnicalServicesSectionProps {
  services: TechnicalServicesData;
}

const iconMap: Record<string, React.ElementType> = {
  wrench: Wrench,
  settings: Settings,
  monitor: Monitor,
  shield: Shield,
  network: Network,
};

export const TechnicalServicesSection = ({ services }: TechnicalServicesSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold lg:text-3xl">Servicios Técnicos</h2>
        <p className="text-muted-foreground mt-2">Soporte integral para tu tecnología</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.items.slice(0, 3).map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {services.items.length > 3 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-2xl lg:mx-auto">
          {services.items.slice(3, 5).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button asChild className="font-heading bg-infra hover:bg-infra-accent text-white">
          <Link href="/infra/technical-services">
            Todos los Servicios
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ServiceCard = ({ service }: { service: ServiceItem }) => {
  const IconComponent = iconMap[service.iconName] || Wrench;

  return (
    <Card className="group border-infra/20 transition-all hover:border-infra/40 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-infra/10 group-hover:bg-infra/20 transition-colors">
            <IconComponent className="h-5 w-5 text-infra" />
          </div>
          <CardTitle className="font-heading text-base">{service.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{service.description}</p>
        <ul className="space-y-1.5">
          {service.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-3.5 w-3.5 text-infra shrink-0" />
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
