'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ui, categoryColors } from './constants';
import type { TechStackResponse } from './types';

interface TechStackSectionProps {
  techStack: TechStackResponse['items'];
}

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Base de Datos',
  devops: 'DevOps',
  tools: 'Herramientas',
};

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
    'mysql',
    'nextjs',
    'postgresql',
    'prometheus',
    'react',
    'rust',
    'typescript',
    'webassembly',
  ];

  const name = availableIcons.includes(iconName) ? iconName : 'default';
  return `/icons/tech/${name}-icon.svg`;
};

export const TechStackSection = ({ techStack }: TechStackSectionProps) => {
  const groupedStack = techStack.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof techStack>,
  );

  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Stack Tecnológico</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tecnologías y herramientas utilizadas</p>
        </div>
        <Badge className="rounded-full bg-tech-solid">Tech Stack</Badge>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedStack).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`rounded-full text-xs ${categoryColors[category]}`}>{categoryLabels[category]}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((tech, idx) => (
                <Card key={idx} className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift} group`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 p-2 group-hover:scale-110 transition-transform">
                        <Image src={getIconPath(tech.iconName)} alt={tech.name} width={24} height={24} className="object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{tech.name}</div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{tech.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
