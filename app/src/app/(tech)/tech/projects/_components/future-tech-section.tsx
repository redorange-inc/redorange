'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import { ui } from './constants';
import type { FutureResponse } from './types';

interface FutureTechSectionProps {
  futureTech: FutureResponse['items'];
}

const getIconPath = (iconName: string): string => {
  const availableIcons = [
    'default',
    'docker',
    'github',
    'go',
    'golang',
    'grafana',
    'java',
    'js',
    'keycloak',
    'kubernetes',
    'mongodb',
    'mysql',
    'nextjs',
    'nodejs',
    'postgresql',
    'prometheus',
    'python',
    'react',
    'redis',
    'rust',
    'typescript',
    'webassembly',
  ];
  const name = availableIcons.includes(iconName) ? iconName : 'default';
  return `/icons/tech/${name}-icon.svg`;
};

export const FutureTechSection = ({ futureTech }: FutureTechSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Próximas Implementaciones</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tecnologías en roadmap de adopción</p>
        </div>
        <Badge className="rounded-full bg-background/60 text-foreground backdrop-blur">
          <Icon name="rocket" size="sm" className="mr-1" />
          Roadmap
        </Badge>
      </div>

      <Card className={`rounded-3xl ${ui.glassCard}`}>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {futureTech.map((tech, idx) => (
              <div key={idx} className={`rounded-2xl ${ui.softBorder} bg-background/60 p-5 backdrop-blur ${ui.hoverLift} group`}>
                <div className="flex items-start gap-4">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 p-2.5 group-hover:scale-110 transition-transform">
                    <Image src={getIconPath(tech.iconName)} alt={tech.name} width={28} height={28} className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{tech.name}</h4>
                      <Badge className="rounded-full bg-tech/20 text-tech text-[10px]">{tech.expectedDate}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tech.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
