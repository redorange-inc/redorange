'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingCart, Globe, Shield, Headphones, Wrench, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HeroData, HighlightsData } from './types';

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
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-infra/30 bg-infra/10 text-infra font-medium">
            <ShoppingCart className="mr-1.5 h-3 w-3" />
            {hero.badge}
          </Badge>
          <div className="flex gap-1">
            {hero.tags.map((tag, index) => (
              <Badge key={index} className="bg-linear-to-r from-infra to-infra-muted text-white text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <h1 className="font-heading text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="block">{hero.title}</span>
          <span className="block text-infra">{hero.titleHighlight}</span>
        </h1>

        <p className="max-w-xl text-base text-muted-foreground leading-relaxed">{hero.description}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="font-heading bg-infra-accent hover:bg-infra-muted text-white">
          <Link href="/infra/products">
            Ir a productos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-heading border-infra/30 hover:bg-infra/10">
          <Link href="/infra/quote">
            Ver detalle
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        {highlights.items.map((highlight, index) => {
          const IconComponent = iconMap[highlight.iconName] || Globe;
          return (
            <div key={index} className="flex items-center gap-2 rounded-lg border border-infra/15 bg-background/50 px-3 py-2 text-sm">
              <IconComponent className="h-4 w-4 text-infra" />
              <div>
                <span className="font-medium text-foreground">{highlight.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
