'use client';

import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';

export const HeroProjects = () => {
  return (
    <section data-anim="fade-up" className="mb-10">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-4">
        <Badge className="rounded-full bg-background/60 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105">
          <Icon name="sparkles" size="sm" className="mr-1 text-tech animate-pulse" />
          Proyectos e Implementaciones
        </Badge>
        <Badge className="rounded-full bg-tech-solid">SSO • MinIO • Microservicios</Badge>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-2xl bg-tech p-4 text-tech">
          <Icon name="layers" size="xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Proyectos Desarrollados</h1>
          <p className="text-muted-foreground mt-1">Soluciones implementadas y stack tecnológico</p>
        </div>
      </div>

      <p className="max-w-3xl text-base text-muted-foreground">
        Hemos desarrollado e implementado sistemas críticos para la operación institucional, incluyendo soluciones de almacenamiento, autenticación centralizada y aplicaciones web modernas con tecnologías de
        vanguardia.
      </p>
    </section>
  );
};
