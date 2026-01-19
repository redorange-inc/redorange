'use client';

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Cpu, Globe, Network, CheckCircle2, ChevronLeft } from 'lucide-react';
import type { ServiceSlide } from '@/actions/fn-services';

const ICONS: Record<ServiceSlide['id'], FC<{ className?: string }>> = {
  'ti-soluciones': Cpu,
  'equipos-comercializacion': Network,
  'telecom-servicios-energia': Globe,
};

const NavPill: FC<{ href: string; active?: boolean; children: React.ReactNode }> = ({ href, active, children }) => {
  return (
    <Link
      href={href}
      className={[
        'inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
        'border border-border/60 backdrop-blur',
        active ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background/60 text-foreground hover:bg-background',
      ].join(' ')}
    >
      {children}
    </Link>
  );
};

export const ServiceDetailClient: FC<{ service: ServiceSlide }> = ({ service }) => {
  const Icon = ICONS[service.id];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className={`absolute inset-0 bg-linear-to-br ${service.gradient}`} />
      <div className="pointer-events-none absolute -right-24 top-28 h-[520px] w-[520px] rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-24 h-[520px] w-[520px] rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 md:px-10 md:pt-24 md:pb-16">
        <div className="sticky top-3 z-30 mb-6 flex items-center justify-between">
          <Button asChild variant="secondary" size="sm" className="font-heading rounded-full bg-background/70 backdrop-blur border border-border/60">
            <Link href="/#services">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver
            </Link>
          </Button>

          <Badge variant="secondary" className="font-heading bg-background/70 backdrop-blur border border-border/60">
            <Icon className={`mr-1.5 h-3.5 w-3.5 ${service.accentColor}`} />
            {service.badge}
          </Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-start">
          <section className="lg:col-span-7">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">{service.title}</h1>

            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{service.subtitle}</p>

            <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur">
              <p className="font-heading text-xs font-extrabold">Principales capacidades</p>

              <ul className="mt-3 space-y-2">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${service.accentColor}`} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button asChild size="default" className="font-heading group rounded-xl">
                <a href={service.href} target="_blank" rel="noreferrer">
                  {service.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button asChild size="default" variant="secondary" className="font-heading group rounded-xl">
                <Link href="/#contact">
                  Contacto
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </section>

          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-border/70 bg-background/75 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-heading text-xs font-semibold text-muted-foreground">Qué incluye</p>
                  <p className="text-xs font-bold">Alcance y entregables</p>
                </div>
              </div>

              <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                {service.deliverables.map((d, i) => (
                  <AccordionItem key={d.title} value={`item-${i}`} className="border-border/50">
                    <AccordionTrigger className="text-left font-heading text-xs py-2 hover:no-underline">{d.title}</AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground pb-2">{d.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-4 rounded-2xl bg-muted/40 p-3 border border-border/40">
                <p className="font-heading text-xs font-extrabold">Modalidad</p>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">Por proyecto, mensual o demanda según SLA.</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Button asChild variant="secondary" size="sm" className="font-heading text-xs flex-1 rounded-xl">
                  <a href={service.href} target="_blank" rel="noreferrer">
                    Ver más
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </Button>

                <Button asChild variant="outline" size="sm" className="font-heading text-xs rounded-xl">
                  <Link href="/#services">Servicios</Link>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/50 backdrop-blur p-5">
              <div className={`absolute inset-0 opacity-30 bg-linear-to-br ${service.gradient}`} />
              <div className="relative flex items-center justify-center">
                <Image src={service.image} alt={service.title} width={520} height={520} className="w-full max-w-[360px] h-auto object-contain drop-shadow-2xl" priority />
              </div>

              <div className="relative mt-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <Icon className={`h-4 w-4 ${service.accentColor}`} />
                  {service.id === 'ti-soluciones' ? 'TI' : service.id === 'equipos-comercializacion' ? 'Equipos' : 'Telecom'}
                </span>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <NavPill href="/services/ti-soluciones" active={service.id === 'ti-soluciones'}>
            TI
          </NavPill>
          <NavPill href="/services/equipos-comercializacion" active={service.id === 'equipos-comercializacion'}>
            Equipos
          </NavPill>
          <NavPill href="/services/telecom-servicios-energia" active={service.id === 'telecom-servicios-energia'}>
            Telecom
          </NavPill>
        </div>
      </div>
    </main>
  );
};
