'use client';

import Image from 'next/image';
import type { NetworkTechnology } from './types';

interface TechnologiesSectionProps {
  technologies: NetworkTechnology[];
}

export const TechnologiesSection = ({ technologies }: TechnologiesSectionProps) => {
  const duplicatedTechs = [...technologies, ...technologies];

  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-center">Tecnologías que Manejamos</h2>

      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-background to-transparent" />

        <div className="flex w-max gap-4 animate-marquee hover:paused">
          {duplicatedTechs.map((tech, index) => (
            <div
              key={`${tech.id}-${index}`}
              className="flex h-14 min-w-[140px] shrink-0 items-center justify-center gap-2 rounded-lg border border-infra/15 bg-background/70 backdrop-blur-sm px-4 transition-all hover:border-infra/40 hover:bg-infra/5"
            >
              {tech.icon && <Image src={tech.icon} alt={tech.name} width={24} height={24} className="h-6 w-6 object-contain" />}
              <span className="font-heading font-semibold text-muted-foreground whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
