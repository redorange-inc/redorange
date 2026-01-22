'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { DynamicIcon } from 'lucide-react/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ContactInfo } from './types';

interface QuickContactProps {
  info: ContactInfo;
}

export const QuickContact = ({ info }: QuickContactProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const animationStarted = useRef(false);

  const waDigits = info.whatsapp.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${waDigits}?text=${encodeURIComponent('Hola, me gustaría obtener información sobre los servicios de TI.')}`;

  useEffect(() => {
    if (animationStarted.current || !cardRef.current) return;
    animationStarted.current = true;

    const card = cardRef.current;
    const icons = card.querySelectorAll('[data-icon]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            icons.forEach((icon, idx) => {
              animate(icon, { scale: [0, 1], rotate: ['0deg', '360deg'], duration: 800, easing: 'easeOutBack', delay: 400 + idx * 150 });
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, []);

  return (
    <section data-anim="fade-up">
      <Card
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl border-tech/30 bg-linear-to-r from-tech/10 via-tech-accent/10 to-background/80 shadow-[0_20px_70px_-45px_rgba(6,182,212,0.5)] backdrop-blur"
      >
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-tech/20 blur-2xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-tech-accent/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-foreground mb-2">¿Prefieres una respuesta inmediata?</h3>
              <p className="text-sm text-muted-foreground">
                Contáctanos directamente por WhatsApp o correo electrónico. Nuestro equipo está disponible para atender tus consultas sobre desarrollo, infraestructura, soporte y más.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="font-heading bg-green-600 hover:bg-green-700 text-white group">
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <span data-icon className="inline-flex items-center justify-center mr-2" style={{ transform: 'scale(0)' }}>
                    <DynamicIcon name="message-circle" size={20} />
                  </span>
                  WhatsApp
                  <DynamicIcon name="arrow-right" size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="font-heading bg-background/50 backdrop-blur hover:bg-background/70 group">
                <a href={`mailto:${info.email}`}>
                  <span data-icon className="inline-flex items-center justify-center mr-2" style={{ transform: 'scale(0)' }}>
                    <DynamicIcon name="mail" size={20} />
                  </span>
                  Enviar correo
                  <DynamicIcon name="arrow-right" size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
