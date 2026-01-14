'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from 'lucide-react';

export const HeroSection: FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden scroll-mt-28">
      {/* Animated background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-3xl animate-pulse" />
        <div className="absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[10%] top-[15%] animate-float">
          <div className="rounded-2xl bg-linear-to-br from-orange-500 to-red-500 p-3 shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="absolute left-[15%] top-[25%] animate-float delay-500">
          <div className="rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 p-3 shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="absolute right-[20%] bottom-[30%] animate-float delay-1000">
          <div className="rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 p-3 shadow-lg">
            <Rocket className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left column - Main content */}
          <div className="space-y-8 text-center lg:text-left">
            <Badge variant="secondary" className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 border-orange-500/20 font-heading text-sm px-4 py-2">
              <Sparkles className="h-4 w-4" />
              Tecnología para operación, crecimiento y continuidad
            </Badge>

            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                Soluciones integrales <span className="bg-linear-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">en IT, servicios digitales</span> e infraestructura
              </h1>
            </div>

            <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto lg:mx-0">
              En Red Orange diseñamos, implementamos y mantenemos soluciones tecnológicas que mejoran procesos y aseguran disponibilidad: software y cloud, web y hosting, hardware y conectividad.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 font-heading text-base group">
                <Link href="/#services">
                  Ver líneas
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading text-base border-2">
                <Link href="/#contact">Hablar con un asesor</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
              {['Consultoría', 'Implementación', 'Soporte', 'Mantenimiento'].map((tag) => (
                <span key={tag} className="rounded-full bg-linear-to-br from-muted to-muted/50 px-4 py-2 text-sm font-medium backdrop-blur border border-border/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right column - Service cards */}
          <div className="relative">
            <div className="rounded-3xl border-2 border-border/50 bg-background/80 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-red-500">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold">Tres líneas, una sola experiencia</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Desliza con tu scroll para recorrer cada línea en pantalla completa y elegir la que necesitas.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 p-5 transition-all hover:shadow-md border border-blue-500/20">
                  <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-40">
                    <Shield className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-blue-600">IT & Technology</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Software, cloud, redes, soporte y continuidad.</p>
                </div>

                <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-purple-500/10 to-pink-500/10 p-5 transition-all hover:shadow-md border border-purple-500/20">
                  <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-40">
                    <Sparkles className="h-10 w-10 text-purple-500" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-purple-600">Digital & Web</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Web institucional, hosting, dominios y correo.</p>
                </div>

                <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 to-red-500/10 p-5 transition-all hover:shadow-md border border-orange-500/20">
                  <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-40">
                    <Zap className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-orange-600">Infra & Telecom</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Hardware, conectividad, redes e instalación.</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-linear-to-r from-orange-500/10 to-red-500/10 p-4 border border-orange-500/20">
                <p className="text-sm font-medium text-foreground">Empieza por las líneas</p>
                <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600 font-heading">
                  <Link href="/#services">
                    Explorar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Floating stats/badges */}
            <div className="absolute -right-6 -top-6 rounded-2xl bg-linear-to-br from-orange-500 to-red-500 p-4 shadow-xl animate-float hidden lg:block">
              <p className="text-xs font-bold text-white/80">SOLUCIONES</p>
              <p className="text-2xl font-extrabold text-white">100+</p>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 p-4 shadow-xl animate-float delay-500 hidden lg:block">
              <p className="text-xs font-bold text-white/80">CLIENTES</p>
              <p className="text-2xl font-extrabold text-white">50+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
