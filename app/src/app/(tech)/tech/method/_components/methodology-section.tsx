'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ui, getIcon } from './constants';
import type { MethodologyResponse } from './types';

interface MethodologySectionProps {
  methodologies: MethodologyResponse['items'];
}

export const MethodologySection = ({ methodologies }: MethodologySectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Metodologías Ágiles</h2>
          <p className="mt-1 text-sm text-muted-foreground">Frameworks de trabajo para entregas de valor continuo</p>
        </div>
        <Badge className="rounded-full bg-tech-solid">Agile</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {methodologies.map((method, idx) => (
          <Card key={idx} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-tech p-3 text-tech">{getIcon(method.iconName, 'lg')}</div>
                <CardTitle className="text-xl">{method.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
              <ul className="space-y-2">
                {method.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-tech" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
