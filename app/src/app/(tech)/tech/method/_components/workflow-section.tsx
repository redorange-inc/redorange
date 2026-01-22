'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { ui, getIcon } from './constants';
import type { WorkflowResponse } from './types';

interface WorkflowSectionProps {
  workflow: WorkflowResponse['items'];
}

export const WorkflowSection = ({ workflow }: WorkflowSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Flujo de Trabajo</h2>
          <p className="mt-1 text-sm text-muted-foreground">Proceso iterativo de desarrollo de software</p>
        </div>
        <Badge className="rounded-full bg-tech-solid">Workflow</Badge>
      </div>

      <Card className={`rounded-3xl ${ui.glassCard} overflow-hidden`}>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflow.map((step, idx) => (
              <div key={idx} className="relative">
                <div className={`rounded-2xl ${ui.softBorder} bg-background/60 p-5 backdrop-blur h-full ${ui.hoverLift} group`}>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-tech flex items-center justify-center text-tech font-bold text-sm group-hover:scale-110 transition-transform">{step.step}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-tech">{getIcon(step.iconName, 'sm')}</span>
                        <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                {idx < workflow.length - 1 && idx % 3 !== 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-tech/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
