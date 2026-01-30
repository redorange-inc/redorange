'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import { ui, statusColors, statusLabels } from './constants';
import type { ProjectsResponse } from './types';

interface ProjectsSectionProps {
  projects: ProjectsResponse['items'];
}

export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Proyectos Implementados</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sistemas y aplicaciones desarrollados</p>
        </div>
        <Badge className="rounded-full bg-foreground text-background">{projects.length} Proyectos</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-tech p-3 text-tech">
                    <Icon name={project.iconName} size="lg" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <span className="text-xs text-muted-foreground">{project.category}</span>
                  </div>
                </div>
                <Badge className={`rounded-full text-xs ${statusColors[project.status]}`}>{statusLabels[project.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

              <div className="mb-4">
                <div className="text-xs font-semibold text-foreground mb-2">Tecnologías</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} className="rounded-full bg-tech/20 text-tech text-[10px] px-2 py-0.5">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-foreground mb-2">Características</div>
                <div className="grid grid-cols-1 gap-1.5">
                  {project.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <Icon name="check-circle" size="sm" className="text-tech shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
