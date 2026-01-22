'use client';

import { Badge } from '@/components/ui/badge';
import { GitBranch, Sparkles } from 'lucide-react';

export const HeroMethod = () => {
  return (
    <section data-anim="fade-up" className="mb-10">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-4">
        <Badge className="rounded-full bg-background/60 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-tech animate-pulse" />
          Metodología y Arquitectura
        </Badge>
        <Badge className="rounded-full bg-tech-solid">Scrum • SOLID • Clean Code</Badge>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-2xl bg-tech p-4 text-tech">
          <GitBranch className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Nuestra Metodología</h1>
          <p className="text-muted-foreground mt-1">Cómo construimos software de calidad</p>
        </div>
      </div>

      <p className="max-w-3xl text-base text-muted-foreground">
        Aplicamos metodologías ágiles y principios de ingeniería de software probados para entregar soluciones robustas, escalables y mantenibles. Cada proyecto se desarrolla siguiendo estándares de la
        industria y mejores prácticas de arquitectura.
      </p>
    </section>
  );
};
