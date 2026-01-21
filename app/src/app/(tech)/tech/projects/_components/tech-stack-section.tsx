'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ui, getIcon, categoryColors } from './constants';
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
                      <div className="rounded-xl bg-tech/20 p-2.5 text-tech group-hover:scale-110 transition-transform">{getIcon(tech.iconName)}</div>
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
