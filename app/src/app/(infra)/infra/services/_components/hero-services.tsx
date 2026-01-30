'use client';

import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import type { ServicesHero } from './types';

interface HeroServicesProps {
  hero: ServicesHero;
}

export const HeroServices = ({ hero }: HeroServicesProps) => {
  return (
    <section data-anim="fade-up" className="mb-10">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-4">
        <Badge className="rounded-full bg-background/60 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105">
          <Icon name="sparkles" size="sm" className="mr-1 text-infra animate-pulse" />
          {hero.badge}
        </Badge>
        <Badge className="rounded-full bg-infra-solid">{hero.tag}</Badge>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-2xl bg-infra p-4 text-infra">
          <Icon name="wrench" size="xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{hero.title}</h1>
          <p className="text-muted-foreground mt-1">Mantenimiento y reparación de equipos</p>
        </div>
      </div>

      <p className="max-w-3xl text-base text-muted-foreground">{hero.description}</p>
    </section>
  );
};
