'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Globe, Shield, Headphones, Wrench, Truck } from 'lucide-react';
import type { HeroData, HighlightsData } from './types';
import { ui } from './constants';

interface HeroSectionProps {
  hero: HeroData;
  highlights: HighlightsData;
}

const iconMap: Record<string, React.ElementType> = {
  globe: Globe,
  shield: Shield,
  headphones: Headphones,
  wrench: Wrench,
  truck: Truck,
};

export const HeroSection = ({ hero, highlights }: HeroSectionProps) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <Badge className="rounded-full bg-background/60 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-infra animate-pulse" />
          {hero.badge}
        </Badge>
        <Badge className="rounded-full bg-infra-solid">{hero.tags.join(' • ')}</Badge>
      </div>

      <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {hero.title}
        <span className="ml-2 text-infra font-mono relative">
          {hero.titleHighlight}
          <span className="absolute -bottom-1 left-0 right-0 h-1 gradient-infra rounded-full" />
        </span>
      </h1>

      <p className="mt-3 max-w-2xl text-base text-muted-foreground">{hero.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className={`bg-infra-muted hover:bg-infra-accent text-white ${ui.hoverLift} group`}>
          <Link href="/infra/products">
            Ir a productos
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button asChild variant="outline" className={`bg-background/50 backdrop-blur hover:bg-background/70 ${ui.hoverLift}`}>
          <Link href="/infra/quote">
            Ver detalle
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3 md:grid-cols-5">
        {highlights.items.map((h) => {
          const IconComponent = iconMap[h.iconName] || Globe;
          return (
            <div key={h.text} className={`rounded-2xl ${ui.softBorder} bg-background/40 p-3 backdrop-blur ${ui.hoverLift} group cursor-default`}>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-infra/10 p-1.5 text-infra transition-transform group-hover:scale-110">
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="text-xs font-semibold text-foreground">{h.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
