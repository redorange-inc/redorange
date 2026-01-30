'use client';

import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ContactHero } from './types';

interface HeroContactProps {
  hero: ContactHero;
}

export const HeroContact = ({ hero }: HeroContactProps) => {
  return (
    <section className="relative py-12 text-center">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-infra/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="outline" className="border-infra/30 bg-background/50 backdrop-blur-sm">
            <Sparkles className="mr-1.5 h-3 w-3 text-infra" />
            {hero.badge}
          </Badge>
          <Badge className="bg-linear-to-r from-infra to-infra-muted text-white">{hero.tag}</Badge>
        </div>

        <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">{hero.title}</h1>

        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">{hero.description}</p>
      </div>
    </section>
  );
};
