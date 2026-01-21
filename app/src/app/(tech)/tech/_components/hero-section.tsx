'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SkeletonHeroSection } from './skeletons';
import { ui, getIcon } from './constants';
import { getHighlights } from '@/actions/tech/fn-get-highlights';

interface HighlightItem {
  title: string;
  desc: string;
  iconName: string;
}

export const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHighlights();
        setHighlights(response.data.items);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching highlights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <SkeletonHeroSection />;
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <Badge className="rounded-full bg-background/60 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-tech animate-pulse" />
          Operación crítica & continuidad
        </Badge>
        <Badge className="rounded-full bg-tech-solid">SLA • Soporte • Desarrollo</Badge>
      </div>

      <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
        Tecnología y Soluciones Informáticas
        <span className="ml-2 text-tech font-mono relative">
          (TI)
          <span className="absolute -bottom-1 left-0 right-0 h-1 gradient-tech rounded-full" />
        </span>
      </h1>

      <p className="mt-3 max-w-2xl text-base text-muted-foreground">Consultoría, desarrollo, soporte y continuidad operativa con métricas claras y enfoque en resultados.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button className={`bg-tech-muted hover:bg-tech-accent text-white ${ui.hoverLift} group`}>
          Ir al servicio
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button variant="outline" className={`bg-background/50 backdrop-blur hover:bg-background/70 ${ui.hoverLift}`}>
          Ver detalle
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.title} className={`rounded-2xl ${ui.softBorder} bg-background/40 p-3 backdrop-blur ${ui.hoverLift} group cursor-default`}>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-tech p-1.5 text-tech transition-transform group-hover:scale-110">{getIcon(h.iconName, 'sm')}</div>
              <div className="text-xs font-semibold text-foreground">{h.title}</div>
            </div>
            <div className="mt-1.5 text-xs text-muted-foreground">{h.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
};
