'use client';

import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';

interface HeroClientsProps {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };
}

export const HeroClients = ({ hero }: HeroClientsProps) => {
  return (
    <section data-anim="fade-up" className="mb-10">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-4">
        <Badge className="rounded-full bg-background/60 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105">
          <Icon name="sparkles" size="sm" className="mr-1 text-primary animate-pulse" />
          {hero.badge}
        </Badge>
        <Badge className="rounded-full bg-primary text-primary-foreground">{hero.subtitle}</Badge>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-2xl bg-primary/10 p-4 text-primary">
          <Icon name="users" size="xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{hero.title}</h1>
          <p className="text-muted-foreground mt-1">Entidades públicas, privadas y personas</p>
        </div>
      </div>

      <p className="max-w-3xl text-base text-muted-foreground">{hero.description}</p>
    </section>
  );
};
