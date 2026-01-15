'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { animate } from 'animejs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, ArrowRight, Sparkles, MapPin, Clock } from 'lucide-react';

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ContactSection: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  //  mailto built on client
  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Cotización / Solicitud de información - Red Orange');
    const body = encodeURIComponent(
      'Hola Red Orange,\n\nMe gustaría solicitar una cotización sobre:\n\n- Línea de servicio: (IT / Digital / Infra)\n- Empresa/Entidad:\n- Plazo estimado:\n- Detalles:\n\nGracias.',
    );
    return `mailto:ventas@redorange.net.pe?subject=${subject}&body=${body}`;
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const headerEls = headerRef.current?.querySelectorAll('[data-contact="header"]') ?? [];
    const cardEls = cardsRef.current?.querySelectorAll('[data-contact="card"]') ?? [];
    const badgeEls = root.querySelectorAll('[data-contact="badge"]');
    const chipsEls = root.querySelectorAll('[data-contact="chip"]');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          //  header reveal
          animate(headerEls, {
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: (el, i) => i * 90,
          });

          //  badge pop
          animate(badgeEls, {
            opacity: [0, 1],
            scale: [0.96, 1],
            duration: 700,
            easing: 'easeOutExpo',
            delay: 120,
          });

          //  cards stagger
          animate(cardEls, {
            opacity: [0, 1],
            translateY: [18, 0],
            scale: [0.985, 1],
            duration: 900,
            easing: 'easeOutExpo',
            delay: (el, i) => 260 + i * 140,
          });

          //  chips subtle
          animate(chipsEls, {
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 700,
            easing: 'easeOutExpo',
            delay: (el, i) => 520 + i * 90,
          });

          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(root);

    //  ambient glow drift
    const glows = root.querySelectorAll('[data-contact="glow"]');
    animate(glows, {
      translateY: [0, 10],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 4200,
      delay: (el, i) => i * 300,
    });

    return () => io.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pb-28 md:pt-24 min-h-screen scroll-mt-28">
      <div data-contact="glow" className="pointer-events-none absolute -right-20 top-16 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div data-contact="glow" className="pointer-events-none absolute -left-20 bottom-16 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div ref={headerRef} className="mb-10 flex flex-col gap-3">
        <div data-contact="badge" className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 backdrop-blur opacity-0 animate-in fade-in duration-700">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Contacto</span>
        </div>

        <h2 className="text-2xl font-extrabold md:text-3xl opacity-0" data-contact="header">
          Contacto y cotizaciones
        </h2>
        <p className="max-w-3xl text-muted-foreground opacity-0" data-contact="header">
          Compártenos tu requerimiento y te enviamos una propuesta con alcance y opciones de servicio.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { icon: Clock, text: 'Respuesta rápida' },
            { icon: MapPin, text: 'Cobertura por proyecto' },
            { icon: Mail, text: 'Correo corporativo' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} data-contact="chip" className="opacity-0 inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground border border-border/50">
              <Icon className="h-3.5 w-3.5 text-foreground/70" />
              {text}
            </span>
          ))}
        </div>
      </div>

      <div ref={cardsRef} className="grid gap-6 md:grid-cols-2">
        <Card data-contact="card" className="border-border/70 bg-background/60 backdrop-blur opacity-0 animate-in fade-in duration-700">
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Formulario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Nombre</label>
                <Input placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Correo</label>
                <Input type="email" placeholder="tu-correo@dominio.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Asunto</label>
              <Input placeholder="Ej. sistema a medida / web institucional / cableado / internet" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Detalle</label>
              <Textarea placeholder="Describe el alcance, plazos y cualquier información relevante." rows={6} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" className="font-heading group animate-in fade-in slide-in-from-bottom-1 duration-700" asChild>
                <a href={mailtoHref}>
                  Enviar por correo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button type="button" variant="secondary" className="font-heading group animate-in fade-in slide-in-from-bottom-1 duration-700 delay-150" asChild>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/#services">
                  Ver servicios
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">Nota: este formulario es una maqueta visual. Si deseas, lo conectamos a correo, backend o CRM.</p>
          </CardContent>
        </Card>

        <Card data-contact="card" className="border-border/70 bg-background/60 backdrop-blur opacity-0 animate-in fade-in duration-700">
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-xl bg-muted/60 p-4 border border-border/50">
              <p className="font-heading text-sm font-bold text-foreground">Razón social</p>
              <p className="mt-1">Red Orange E.I.R.L.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-muted/60 p-4 border border-border/50">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-foreground" />
                  <p className="font-heading text-sm font-bold text-foreground">Correo</p>
                </div>
                <p className="mt-1">ventas@redorange.net.pe</p>
              </div>

              <div className="rounded-xl bg-muted/60 p-4 border border-border/50">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-foreground" />
                  <p className="font-heading text-sm font-bold text-foreground">Teléfono</p>
                </div>
                <p className="mt-1">Agregar número</p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/60 p-4 border border-border/50">
              <p className="font-heading text-sm font-bold text-foreground">Cobertura</p>
              <p className="mt-1">Implementación y soporte por proyecto, mensual o por demanda.</p>
            </div>

            <div className="rounded-xl border border-border/60 bg-background/40 p-4">
              <p className="font-heading text-sm font-bold text-foreground">Atención</p>
              <p className="mt-1">Cotizaciones, coordinación técnica y programación de visitas según necesidad.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
