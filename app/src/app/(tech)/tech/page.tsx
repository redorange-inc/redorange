'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState, CSSProperties } from 'react';
import { animate } from 'animejs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Headphones, Settings, ShieldCheck, Wrench, TrendingUp, Clock, Award, Zap, ArrowRight, Sparkles, Activity, Server, Database, Code2 } from 'lucide-react';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

const SkeletonPulse = ({ className = '', style }: SkeletonProps) => (
  <div
    className={`animate-pulse rounded-xl bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-size-[200%_100%] ${className}`}
    style={{ animation: 'shimmer 1.5s ease-in-out infinite', ...style }}
  />
);

const SkeletonStatCard = () => (
  <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/60 bg-white/40 dark:bg-white/5 p-3 backdrop-blur">
    <div className="flex items-center justify-between">
      <SkeletonPulse className="h-10 w-10 rounded-xl" />
      <div className="text-right space-y-2">
        <SkeletonPulse className="h-6 w-16 ml-auto" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
    </div>
  </div>
);

const SkeletonAchievementCard = () => (
  <Card className="rounded-3xl border-white/40 bg-white/40 dark:border-white/10 dark:bg-slate-950/30 backdrop-blur">
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-10 w-10 rounded-2xl" />
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-3 w-20" />
          </div>
        </div>
        <SkeletonPulse className="h-9 w-16 rounded-2xl" />
      </div>
    </CardContent>
  </Card>
);

const SkeletonChart = () => (
  <div className="h-[300px] w-full p-4">
    <div className="flex h-full items-end justify-between gap-3">
      {[65, 85, 45, 90, 70, 55].map((height, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <SkeletonPulse className="w-full rounded-t-lg" style={{ height: `${height}%` }} />
          <SkeletonPulse className="h-3 w-12" />
        </div>
      ))}
    </div>
  </div>
);

interface Stat {
  key: 'projects' | 'clients' | 'tickets' | 'uptime';
  label: string;
  value: number;
  suffix?: string;
  helper?: string;
  icon: React.ReactNode;
}

interface ImpactRow {
  area: string;
  value: number;
}

interface Achievement {
  title: string;
  description: string;
  metric: string;
  icon: React.ReactNode;
}

interface TimeSeriesData {
  month: string;
  rendimiento: number;
  satisfaccion: number;
}

interface ServiceItem {
  text: string;
  icon: React.ReactNode;
}

type AnimatedMap = Record<string, number>;

interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    value?: number | string;
    name?: string;
    dataKey?: string;
    color?: string;
  }>;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <Card className="border-orange-200/60 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-orange-800/50 dark:bg-slate-950/90">
      <CardContent className="p-4">
        <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">{String(label ?? '')}</div>
        <div className="space-y-1.5">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600 dark:text-slate-400">{entry.name}:</span>
              <span className="font-bold text-slate-900 dark:text-white">{String(entry.value)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ui = {
  glassCard: 'border-white/40 bg-white/40 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30',
  softBorder: 'border border-slate-200/50 dark:border-slate-800/40',
  hoverLift: 'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(249,115,22,0.4)]',
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const statsConfig = useMemo<Stat[]>(
    () => [
      {
        key: 'projects',
        label: 'Proyectos ejecutados',
        value: 127,
        helper: 'Implementaciones completadas',
        icon: <Wrench className="h-4 w-4" />,
      },
      {
        key: 'clients',
        label: 'Clientes atendidos',
        value: 58,
        helper: 'Empresas y organizaciones',
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        key: 'tickets',
        label: 'Tickets resueltos',
        value: 4280,
        helper: 'Mesa de ayuda y soporte',
        icon: <Headphones className="h-4 w-4" />,
      },
      {
        key: 'uptime',
        label: 'Disponibilidad',
        value: 99.8,
        suffix: '%',
        helper: 'Servicios críticos',
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    [],
  );

  const impactDataFinal = useMemo<ImpactRow[]>(
    () => [
      { area: 'Desarrollo', value: 92 },
      { area: 'Infraestructura', value: 88 },
      { area: 'Redes', value: 76 },
      { area: 'Soporte', value: 95 },
      { area: 'Automatización', value: 84 },
      { area: 'Capacitación', value: 71 },
    ],
    [],
  );

  const timeSeriesDataFinal = useMemo<TimeSeriesData[]>(
    () => [
      { month: 'Ene', rendimiento: 78, satisfaccion: 85 },
      { month: 'Feb', rendimiento: 82, satisfaccion: 88 },
      { month: 'Mar', rendimiento: 85, satisfaccion: 90 },
      { month: 'Abr', rendimiento: 79, satisfaccion: 82 },
      { month: 'May', rendimiento: 88, satisfaccion: 92 },
      { month: 'Jun', rendimiento: 91, satisfaccion: 94 },
      { month: 'Jul', rendimiento: 93, satisfaccion: 95 },
      { month: 'Ago', rendimiento: 90, satisfaccion: 91 },
      { month: 'Sep', rendimiento: 94, satisfaccion: 96 },
      { month: 'Oct', rendimiento: 96, satisfaccion: 97 },
      { month: 'Nov', rendimiento: 95, satisfaccion: 96 },
      { month: 'Dic', rendimiento: 98, satisfaccion: 99 },
    ],
    [],
  );

  const serviceItems = useMemo<ServiceItem[]>(
    () => [
      { text: 'Consultoría y asesoría en informática y cómputo', icon: <Code2 className="h-5 w-5" /> },
      { text: 'Desarrollo de software, sistemas y aplicaciones', icon: <Database className="h-5 w-5" /> },
      { text: 'Programación y construcción de sistemas informáticos', icon: <Server className="h-5 w-5" /> },
      { text: 'Administración y mantenimiento de sistemas, servidores y aplicaciones', icon: <Settings className="h-5 w-5" /> },
      { text: 'Gestión de redes, bases de datos, mejora de procesos y capacitación', icon: <Activity className="h-5 w-5" /> },
      { text: 'Monitoreo, disponibilidad y continuidad operativa', icon: <ShieldCheck className="h-5 w-5" /> },
    ],
    [],
  );

  const achievements = useMemo<Achievement[]>(
    () => [
      {
        title: 'Respuesta rápida',
        description: 'Tiempo promedio',
        metric: '< 15 min',
        icon: <Clock className="h-4 w-4" />,
      },
      {
        title: 'Certificaciones',
        description: 'Equipo certificado',
        metric: '28+',
        icon: <Award className="h-4 w-4" />,
      },
      {
        title: 'Automatización',
        description: 'Procesos optimizados',
        metric: '65%',
        icon: <Zap className="h-4 w-4" />,
      },
    ],
    [],
  );

  const [animatedValues, setAnimatedValues] = useState<AnimatedMap>({ projects: 0, clients: 0, tickets: 0, uptime: 0 });
  const [impactData, setImpactData] = useState<ImpactRow[]>(impactDataFinal.map((d) => ({ ...d, value: 0 })));
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>(timeSeriesDataFinal.map((d) => ({ ...d, rendimiento: 0, satisfaccion: 0 })));

  const animationStarted = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = serviceItems.length;

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading, totalSlides]);

  useEffect(() => {
    if (isLoading || animationStarted.current) return;
    animationStarted.current = true;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="fade-up"]'));
    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px) scale(0.98)';
    });
    elements.forEach((el, idx) => {
      animate(el, {
        opacity: [0, 1],
        transform: ['translateY(24px) scale(0.98)', 'translateY(0px) scale(1)'],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 100 + 80 * idx,
      });
    });

    statsConfig.forEach((s) => {
      const obj = { v: 0 };
      animate(obj, {
        v: s.value,
        duration: 1800,
        easing: 'easeOutExpo',
        delay: 200,
        update: () => {
          setAnimatedValues((prev) => ({
            ...prev,
            [s.key]: Number.isInteger(s.value) ? Math.round(obj.v) : Number(obj.v.toFixed(1)),
          }));
        },
      });
    });

    impactDataFinal.forEach((row, idx) => {
      const obj = { v: 0 };
      animate(obj, {
        v: row.value,
        duration: 2000,
        easing: 'easeOutQuart',
        delay: 400 + idx * 80,
        update: () => {
          setImpactData((prev) => {
            const newData = [...prev];
            newData[idx] = { area: row.area, value: Math.round(obj.v) };
            return newData;
          });
        },
      });
    });

    timeSeriesDataFinal.forEach((row, idx) => {
      const obj = { r: 0, s: 0 };
      animate(obj, {
        r: row.rendimiento,
        s: row.satisfaccion,
        duration: 2500,
        easing: 'easeOutQuart',
        delay: 600 + idx * 60,
        update: () => {
          setTimeSeriesData((prev) => {
            const newData = [...prev];
            newData[idx] = {
              month: row.month,
              rendimiento: Math.round(obj.r),
              satisfaccion: Math.round(obj.s),
            };
            return newData;
          });
        },
      });
    });

    const particles = document.querySelectorAll<HTMLElement>('[data-particle]');
    particles.forEach((particle, idx) => {
      animate(particle, {
        translateY: [0, -15, 0],
        translateX: [0, idx % 2 === 0 ? 8 : -8, 0],
        opacity: [0.3, 0.6, 0.3],
        duration: 4000 + idx * 500,
        easing: 'easeInOutSine',
        loop: true,
        delay: idx * 200,
      });
    });
  }, [isLoading, statsConfig, impactDataFinal, timeSeriesDataFinal]);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 pt-20">
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.5s ease-out forwards;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div data-particle className="absolute -top-24 left-1/2 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-orange-300/25 blur-3xl dark:bg-orange-500/15" />
        <div data-particle className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-blue-300/25 blur-3xl dark:bg-blue-600/10" />
        <div data-particle className="absolute right-[-160px] top-[240px] h-[420px] w-[420px] rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-500/10" />
        <div data-particle className="absolute left-1/4 top-1/3 h-[200px] w-[200px] rounded-full bg-emerald-300/15 blur-2xl dark:bg-emerald-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.04),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[900px] h-[900px] opacity-[0.12] dark:opacity-[0.08]">
            <Image src="/img/tech.png" alt="" fill className="object-contain" priority />
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <section className="grid gap-8 lg:grid-cols-12" data-anim="fade-up">
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <SkeletonPulse className="h-6 w-48 rounded-full" />
                  <SkeletonPulse className="h-6 w-32 rounded-full" />
                </div>
                <SkeletonPulse className="h-12 w-full max-w-lg" />
                <SkeletonPulse className="h-12 w-3/4" />
                <SkeletonPulse className="h-5 w-full max-w-xl" />
                <div className="flex gap-3 mt-6">
                  <SkeletonPulse className="h-10 w-32 rounded-lg" />
                  <SkeletonPulse className="h-10 w-28 rounded-lg" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3 mt-7">
                  {[1, 2, 3].map((i) => (
                    <SkeletonPulse key={i} className="h-20 rounded-2xl" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-white/60 text-slate-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-slate-200 transition-all hover:scale-105">
                    <Sparkles className="mr-1 h-3.5 w-3.5 text-orange-500 animate-pulse" />
                    Operación crítica & continuidad
                  </Badge>
                  <Badge className="rounded-full bg-orange-100/80 text-orange-800 dark:bg-orange-950/35 dark:text-orange-300">SLA • Soporte • Desarrollo</Badge>
                </div>

                <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-white">
                  Tecnología y Soluciones Informáticas
                  <span className="ml-2 text-orange-600 dark:text-orange-400 relative">
                    (TI)
                    <span className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-orange-400 to-amber-400 rounded-full" />
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">Consultoría, desarrollo, soporte y continuidad operativa con métricas claras y enfoque en resultados.</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button className={`bg-orange-500 hover:bg-orange-600 ${ui.hoverLift} group`}>
                    Ir al servicio
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" className={`bg-white/50 backdrop-blur hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10 ${ui.hoverLift}`}>
                    Ver detalle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    { title: 'Soporte 24/7', desc: 'Según SLA y criticidad', icon: <Headphones className="h-4 w-4" /> },
                    { title: 'Entrega ágil', desc: 'Ciclos cortos y medibles', icon: <Zap className="h-4 w-4" /> },
                    { title: 'Seguridad', desc: 'Buenas prácticas y hardening', icon: <ShieldCheck className="h-4 w-4" /> },
                  ].map((h) => (
                    <div key={h.title} className={`rounded-2xl ${ui.softBorder} bg-white/40 p-3 backdrop-blur dark:bg-white/5 ${ui.hoverLift} group cursor-default`}>
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-orange-100/80 p-1.5 text-orange-600 dark:bg-orange-950/35 dark:text-orange-400 transition-transform group-hover:scale-110">{h.icon}</div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">{h.title}</div>
                      </div>
                      <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">{h.desc}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-5">
            <Card className={`relative overflow-hidden rounded-3xl ${ui.glassCard}`} data-anim="fade-up">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-400/20 blur-2xl dark:bg-orange-500/15" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }} />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-400/20 blur-2xl dark:bg-blue-600/10" style={{ animation: 'pulse-glow 5s ease-in-out infinite 1s' }} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Vista general</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Capacidades y entregables</div>
                  </div>
                  <Badge className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 transition-transform hover:scale-105">TI</Badge>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {isLoading ? (
                    <>
                      <SkeletonStatCard />
                      <SkeletonStatCard />
                      <SkeletonStatCard />
                      <SkeletonStatCard />
                    </>
                  ) : (
                    statsConfig.map((s) => (
                      <div key={s.key} className={`rounded-2xl ${ui.softBorder} bg-white/40 p-3 backdrop-blur dark:bg-white/5 ${ui.hoverLift} group`}>
                        <div className="flex items-center justify-between">
                          <div className="rounded-xl bg-orange-100/80 p-2 text-orange-700 dark:bg-orange-950/35 dark:text-orange-300 transition-all group-hover:scale-110 group-hover:rotate-3">{s.icon}</div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                              {animatedValues[s.key]}
                              {s.suffix ?? ''}
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300">{s.label}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl bg-white/40 p-4 backdrop-blur dark:bg-white/5">
                  {isLoading ? (
                    <div className="space-y-2">
                      <SkeletonPulse className="h-4 w-32" />
                      <SkeletonPulse className="h-3 w-full" />
                      <SkeletonPulse className="h-3 w-4/5" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                        Modalidad flexible
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Por proyecto, mensual o demanda según SLA. Cobertura adaptable a picos operativos.</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <Card className={`rounded-3xl ${ui.glassCard}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Qué incluye</CardTitle>
                  <CardDescription className="text-sm">Alcance y entregables del servicio</CardDescription>
                </div>
                {!isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: totalSlides }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-orange-500' : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/40 dark:bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <SkeletonPulse className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <SkeletonPulse className="h-5 w-full" />
                      <SkeletonPulse className="h-5 w-3/4" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden min-h-[80px]">
                  {serviceItems.map((item, idx) => (
                    <div key={idx} className={`${idx === currentSlide ? 'block animate-fadeSlideIn' : 'hidden'}`}>
                      <div className={`group flex items-center gap-4 rounded-2xl ${ui.softBorder} bg-white/40 p-5 backdrop-blur ${ui.hoverLift} dark:bg-white/5`}>
                        <div className="rounded-xl bg-orange-100/80 p-3 text-orange-700 dark:bg-orange-950/35 dark:text-orange-300 transition-all group-hover:scale-110">{item.icon}</div>
                        <div className="text-base font-medium text-slate-700 dark:text-slate-200">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-12" data-anim="fade-up">
          <Card className={`rounded-3xl lg:col-span-6 ${ui.glassCard}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Impacto por área
              </CardTitle>
              <CardDescription className="text-sm">Resultados medibles en cada especialidad</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <SkeletonChart />
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                          <stop offset="100%" stopColor="#ea580c" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-slate-200/80 dark:stroke-slate-700/70" />
                      <XAxis dataKey="area" tickLine={false} axisLine={false} className="text-xs" tick={{ fill: 'currentColor' }} />
                      <YAxis tickLine={false} axisLine={false} width={35} className="text-xs" tick={{ fill: 'currentColor' }} domain={[0, 100]} />
                      <ReTooltip content={(props) => <CustomTooltip {...(props as unknown as CustomTooltipProps)} />} cursor={{ fill: 'rgba(249, 115, 22, 0.08)' }} />
                      <Bar dataKey="value" name="Impacto" radius={[10, 10, 0, 0]} fill="url(#barGradient)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`rounded-3xl lg:col-span-6 ${ui.glassCard}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white">
                <Activity className="h-5 w-5 text-blue-500" />
                Tendencia anual
              </CardTitle>
              <CardDescription className="text-sm">Evolución de métricas clave 2024</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <SkeletonChart />
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                      <defs>
                        <linearGradient id="rendimientoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="satisfaccionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-slate-200/80 dark:stroke-slate-700/70" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" tick={{ fill: 'currentColor' }} />
                      <YAxis tickLine={false} axisLine={false} width={35} className="text-xs" tick={{ fill: 'currentColor' }} domain={[0, 100]} />
                      <ReTooltip content={(props) => <CustomTooltip {...(props as unknown as CustomTooltipProps)} />} />
                      <Area type="monotone" dataKey="rendimiento" name="Rendimiento" stroke="#f97316" strokeWidth={2} fill="url(#rendimientoGrad)" />
                      <Area type="monotone" dataKey="satisfaccion" name="Satisfacción" stroke="#3b82f6" strokeWidth={2} fill="url(#satisfaccionGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {!isLoading && (
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Rendimiento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Satisfacción</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Logros destacados</h3>
            <Badge className="rounded-full bg-white/60 text-slate-700 backdrop-blur dark:bg-white/10 dark:text-slate-200">KPIs</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {isLoading ? (
              <>
                <SkeletonAchievementCard />
                <SkeletonAchievementCard />
                <SkeletonAchievementCard />
              </>
            ) : (
              achievements.map((achievement, idx) => (
                <Card key={idx} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-orange-100/80 p-3 text-orange-700 dark:bg-orange-950/35 dark:text-orange-300">{achievement.icon}</div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">{achievement.title}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">{achievement.description}</div>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 px-4 py-2 text-sm font-bold text-white dark:from-white dark:to-slate-100 dark:text-slate-900 shadow-lg">
                        {achievement.metric}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <Card className="relative overflow-hidden rounded-3xl border border-orange-200/40 bg-linear-to-r from-orange-50/80 via-amber-50/80 to-white/80 shadow-[0_20px_70px_-45px_rgba(249,115,22,0.6)] backdrop-blur dark:border-orange-900/40 dark:from-orange-950/25 dark:via-amber-950/15 dark:to-slate-950/80">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-orange-400/25 blur-2xl dark:bg-orange-500/15" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }} />
            <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10" style={{ animation: 'pulse-glow 4s ease-in-out infinite 1s' }} />
            <CardContent className="relative p-6">
              {isLoading ? (
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl space-y-3">
                    <SkeletonPulse className="h-7 w-80" />
                    <SkeletonPulse className="h-4 w-full max-w-lg" />
                    <div className="flex gap-2 mt-3">
                      {[1, 2, 3, 4].map((i) => (
                        <SkeletonPulse key={i} className="h-6 w-20 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <SkeletonPulse className="h-12 w-40 rounded-lg" />
                    <SkeletonPulse className="h-12 w-36 rounded-lg" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">¿Listo para optimizar tu infraestructura TI?</h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Hablemos sobre cómo impulsar tu organización con soluciones tecnológicas modernas, seguras y medibles.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Evaluación', 'Roadmap', 'Implementación', 'Soporte'].map((t) => (
                        <Badge key={t} className="rounded-full bg-white/60 text-slate-700 backdrop-blur dark:bg-white/10 dark:text-slate-200 transition-transform hover:scale-105">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" className={`bg-orange-500 hover:bg-orange-600 ${ui.hoverLift} group`}>
                      Solicitar cotización
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button size="lg" variant="outline" className={`bg-white/50 backdrop-blur hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10 ${ui.hoverLift}`}>
                      Agendar llamada
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default Page;
