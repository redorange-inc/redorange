'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const CtaSection = () => {
  const tags = ['Cotización', 'Importación', 'Instalación', 'Soporte'];
  const features = ['Respuesta en 24h', 'Garantía incluida', 'Envío nacional'];

  return (
    <Card className="border-infra/20 bg-linear-to-r from-infra/5 via-infra/10 to-infra-muted/5 overflow-hidden" data-anim="fade-up">
      <CardContent className="p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold lg:text-3xl">¿Necesitas equipos tecnológicos?</h2>
            <p className="text-muted-foreground max-w-lg">Hablemos sobre cómo impulsar tu organización con equipos de calidad, importación directa y soporte técnico garantizado.</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-infra/30 bg-background/50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <Button asChild size="lg" className="font-heading bg-infra hover:bg-infra-accent text-white w-full lg:w-auto">
              <Link href="/infra/quote">
                Solicitar cotización
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-heading border-infra/30 hover:bg-infra/10 w-full lg:w-auto">
              <Link href="/infra/contact">
                Agendar llamada
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-infra/10">
          {features.map((feature) => (
            <span key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {feature}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
