'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { NetworkProject } from './types';

interface ProjectsSectionProps {
  projects: NetworkProject[];
}

export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">Proyectos Realizados</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="border-infra/20 bg-card/60 backdrop-blur-md transition-all hover:border-infra/40"
          >
            <CardContent className="p-5">
              <Badge className="bg-infra/10 text-infra border-infra/20 mb-3">
                {project.category}
              </Badge>
              <h3 className="font-heading font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              <p className="font-heading text-2xl font-bold text-infra mt-3">
                {project.points}+
                <span className="text-sm font-normal text-muted-foreground ml-1">puntos</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
