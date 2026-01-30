'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import { ui } from './constants';
import type { ServiceCategoriesResponse } from './types';

interface ServiceCategoriesSectionProps {
  categories: ServiceCategoriesResponse['items'];
}

export const ServiceCategoriesSection = ({ categories }: ServiceCategoriesSectionProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Áreas de Servicio</h2>
          <p className="mt-1 text-sm text-muted-foreground">Servicios organizados por especialidad</p>
        </div>
        <Badge className="rounded-full bg-foreground text-background">{categories.length} Áreas</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift} cursor-pointer transition-all ${expandedCategory === category.id ? 'ring-2 ring-tech' : ''}`}
            onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-tech p-3 text-tech">
                    <Icon name={category.iconName} size="lg" />
                  </div>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                </div>
                <Icon name="chevron-right" size="md" className={`text-muted-foreground transition-transform ${expandedCategory === category.id ? 'rotate-90' : ''}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{category.description}</p>

              {expandedCategory === category.id && (
                <div className="mt-4 space-y-3 pt-3 border-t border-border/50">
                  {category.services.map((service, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-tech mt-1.5 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-foreground">{service.title}</div>
                          <p className="text-[10px] text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
