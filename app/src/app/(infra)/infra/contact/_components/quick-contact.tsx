'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from './icon';
import type { ContactInfo } from './types';

interface QuickContactProps {
  info: ContactInfo;
}

export const QuickContact = ({ info }: QuickContactProps) => {
  const waDigits = info.whatsapp.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${waDigits}?text=${encodeURIComponent('Hola, me gustaría solicitar información sobre equipos tecnológicos.')}`;

  return (
    <section data-anim="fade-up">
      <Card className="relative overflow-hidden rounded-3xl border-infra/30 bg-linear-to-r from-infra/10 via-infra-accent/10 to-background/80 shadow-[0_20px_70px_-45px_rgba(6,182,212,0.5)] backdrop-blur">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-infra/20 blur-2xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-infra-accent/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-foreground mb-2">¿Prefieres una respuesta inmediata?</h3>
              <p className="text-sm text-muted-foreground">
                Contáctanos directamente por WhatsApp o correo electrónico. Nuestro equipo está disponible para atender tus consultas sobre equipamiento tecnológico.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="font-heading bg-green-600 hover:bg-green-700 text-white group">
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <span className="inline-flex items-center justify-center mr-2">
                    <Image src="/icons/whatsapp-icon.svg" alt="WhatsApp" width={16} height={16} className="brightness-0 invert" />
                  </span>
                  WhatsApp
                  <Icon name="arrow-right" size="sm" className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="font-heading bg-background/50 backdrop-blur hover:bg-background/70 group">
                <a href={`mailto:${info.email}`}>
                  <span className="inline-flex items-center justify-center mr-2">
                    <Icon name="mail" size="md" />
                  </span>
                  Enviar correo
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
