'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from './icon';

interface ContactCTAProps {
  phone: string;
  whatsapp: string;
}

export const ContactCTA = ({ phone, whatsapp }: ContactCTAProps) => {
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola, necesito una solución de redes para mi empresa.')}`;

  return (
    <section data-anim="fade-up">
      <Card className="relative overflow-hidden rounded-3xl border-infra/30 bg-linear-to-r from-infra/10 via-infra-accent/10 to-background/80 shadow-[0_20px_70px_-45px_rgba(6,182,212,0.5)] backdrop-blur">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-infra/20 blur-2xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-infra-accent/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-infra/20 p-3 text-infra">
                <Icon name="network" size="lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">¿Necesitas una solución de redes?</h3>
                <p className="text-sm text-muted-foreground">Contáctanos: {phone}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="font-heading bg-green-600 hover:bg-green-700 text-white group">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <Image src="/icons/whatsapp-icon.svg" alt="WhatsApp" width={16} height={16} className="mr-2 brightness-0 invert" />
                  Solicitar Cotización
                  <Icon name="arrow-right" size="sm" className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
