'use client';

import Link from 'next/link';
import { ArrowRight, Package, Truck, Wrench, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HighlightItem } from './types';

interface HeroSectionProps {
  highlights: HighlightItem[];
}

const iconMap: Record<string, React.ElementType> = {
  globe: Package,
  shield: Package,
  headphones: Package,
  wrench: Wrench,
  truck: Truck,
};

export const HeroSection = ({ highlights }: HeroSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Badge variant="outline" className="border-infra/30 bg-infra/10 text-infra font-medium">
          Equipos y Tecnología
        </Badge>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl">
          <span className="block">Comercialización e</span>
          <span className="block text-infra">Importación de Equipos</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Importación, distribución y comercialización de equipos de cómputo, accesorios, telecomunicaciones y robótica. Servicios técnicos especializados con garantía.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {highlights.map((highlight, index) => {
          const IconComponent = iconMap[highlight.iconName] || Package;
          return (
            <div key={index} className="flex items-center gap-2 rounded-full border border-infra/20 bg-infra/5 px-3 py-1.5 text-sm">
              <IconComponent className="h-4 w-4 text-infra" />
              <span className="text-foreground/80">{highlight.text}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button asChild size="lg" className="font-heading bg-infra hover:bg-infra-accent text-white">
          <Link href="/infra/products">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Ver Productos
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-heading border-infra/30 hover:bg-infra/10">
          <Link href="/infra/quote">
            Cotizar Ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
