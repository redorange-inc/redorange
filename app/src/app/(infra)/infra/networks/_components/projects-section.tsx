'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ui } from './constants';
import type { NetworkProject } from './types';

interface ProjectsSectionProps {
  projects: NetworkProject[];
}

export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Proyectos Realizados</h2>
        <p className="mt-1 text-sm text-muted-foreground">Implementaciones exitosas</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <Card key={project.id} className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift}`}>
            <CardContent className="p-5">
              <Badge className="bg-infra/10 text-infra border-infra/20 mb-3">{project.category}</Badge>
              <h3 className="font-semibold text-foreground">{project.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              <p className="text-2xl font-bold text-infra mt-3">
                {project.points}+<span className="text-sm font-normal text-muted-foreground ml-1">puntos</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
