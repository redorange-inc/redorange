'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const CtaSection = () => {
  return (
    <Card className="border-infra/20 bg-linear-to-br from-infra/5 via-infra/3 to-transparent" data-anim="fade-up">
      <CardContent className="p-8 lg:p-12">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-bold lg:text-3xl">¿Necesitas equipos tecnológicos?</h2>
            <p className="max-w-2xl text-muted-foreground">Cotiza sin compromiso. Ofrecemos los mejores precios en importación directa, instalación profesional y soporte técnico garantizado.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="font-heading bg-infra hover:bg-infra-accent text-white">
              <Link href="/infra/quote">
                <FileText className="mr-2 h-5 w-5" />
                Solicitar Cotización
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-heading border-infra/30 hover:bg-infra/10">
              <Link href="/infra/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contactar Ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Respuesta en 24h
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Garantía incluida
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Envío nacional
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
