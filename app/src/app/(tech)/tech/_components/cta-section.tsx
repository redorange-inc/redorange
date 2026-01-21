'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { SkeletonCtaSection } from './skeletons';
import { ui } from './constants';

const CTA_TAGS = ['Evaluación', 'Roadmap', 'Implementación', 'Soporte'];

export const CtaSection = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section data-anim="fade-up">
      <Card className="relative overflow-hidden rounded-3xl border-(--tech-border) bg-linear-to-r from-(--tech-bg) via-tech-muted to-background/80 shadow-[0_20px_70px_-45px_rgba(6,182,212,0.6)] backdrop-blur">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-(--tech-gradient-from) blur-2xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-(--tech-accent)/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <CardContent className="relative p-6">
          {isLoading ? (
            <SkeletonCtaSection />
          ) : (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-foreground">¿Listo para optimizar tu infraestructura TI?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Hablemos sobre cómo impulsar tu organización con soluciones tecnológicas modernas, seguras y medibles.</p>
                <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
                  {CTA_TAGS.map((t) => (
                    <Badge key={t} className="rounded-full bg-background/60 text-foreground backdrop-blur transition-transform hover:scale-105">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className={`bg-tech-accent hover:bg-tech-muted text-white ${ui.hoverLift} group`}>
                  Solicitar cotización
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className={`bg-background/50 backdrop-blur hover:bg-background/70 ${ui.hoverLift}`}>
                  Agendar llamada
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
