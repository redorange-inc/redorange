'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { ui, getIcon } from './constants';
import type { ArchitecturesResponse } from './types';

interface ArchitecturesSectionProps {
  architectures: ArchitecturesResponse['items'];
}

export const ArchitecturesSection = ({ architectures }: ArchitecturesSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Arquitecturas de Software</h2>
          <p className="mt-1 text-sm text-muted-foreground">Patrones estructurales para sistemas escalables y mantenibles</p>
        </div>
        <Badge className="rounded-full bg-background/60 text-foreground backdrop-blur">Patterns</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {architectures.map((arch, idx) => (
          <Card key={idx} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-tech p-3 text-tech">{getIcon(arch.iconName, 'lg')}</div>
                <CardTitle className="text-lg leading-tight">{arch.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{arch.description}</p>
              <div className="space-y-2">
                {arch.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 text-tech shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
