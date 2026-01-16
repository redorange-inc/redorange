'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { animate, stagger } from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  Sparkles,
  ArrowRight,
  Rocket,
  Code2,
  Building2,
  Palette,
  Terminal,
  Mail,
  ExternalLink,
  Star,
  Zap,
  Users,
  Boxes,
  Target,
  Award,
} from 'lucide-react';
import type { TeamMember, TeamMemberSocial } from '@/actions/fn-teams';

type TeamGridProps = {
  members: TeamMember[];
};

const socialIcons: Record<TeamMemberSocial['platform'], FC<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
};

const overrideIcons: Record<string, FC<{ className?: string }>> = {
  boxes: Boxes,
  rocket: Rocket,
  target: Target,
  award: Award,
};

const departmentConfig: Record<TeamMember['department'], { icon: FC<{ className?: string }>; gradient: string; badge: string }> = {
  Liderazgo: {
    icon: Rocket,
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  Tecnología: {
    icon: Code2,
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  },
  'Gestión Pública': {
    icon: Building2,
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30',
  },
  Diseño: {
    icon: Palette,
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
  },
  Desarrollo: {
    icon: Terminal,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
};

const getInitials = (name: string): string => {
  const words = name.split(' ').filter((word) => word.length > 0);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();

  return words[0]?.substring(0, 2).toUpperCase() || '??';
};

const AnimatedNumber: FC<{ value: string; delay?: number }> = ({ value, delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const numericMatch = value.match(/^(\d+)/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(numericMatch[1], 10);
    const suffix = value.replace(/^\d+/, '');

    const timeout = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();

      const updateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(targetNum * eased);

        setDisplayValue(`${current}${suffix}`);

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      };

      requestAnimationFrame(updateNumber);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <span ref={ref}>{displayValue}</span>;
};

const MemberCard: FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const config = departmentConfig[member.department];
  const DepartmentIcon = member.iconOverride ? overrideIcons[member.iconOverride] : config.icon;
  const initials = getInitials(member.name);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400 + index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (!avatarRef.current) return;

    const pulseAnimation = animate(avatarRef.current.querySelector('[data-avatar-ring]'), {
      scale: [1, 1.08, 1],
      opacity: [0.4, 0.7, 0.4],
      duration: 3000,
      easing: 'easeInOutSine',
      loop: true,
      delay: index * 200,
    });

    return () => pulseAnimation.pause();
  }, [index]);

  useEffect(() => {
    if (!cardRef.current || !isHovered) return;

    animate(cardRef.current.querySelectorAll('[data-tag]'), {
      translateY: [5, 0],
      opacity: [0.7, 1],
      duration: 300,
      easing: 'easeOutExpo',
      delay: stagger(30),
    });
  }, [isHovered]);

  return (
    <div ref={cardRef} data-team="card" className="group relative opacity-0" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-500 hover:border-primary/30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/30" />

        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl transition-transform duration-700 group-hover:scale-150" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-gradient-to-tr from-secondary/10 to-transparent blur-2xl transition-transform duration-700 group-hover:scale-150" />

        <div className="relative px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
          <div className="flex flex-col items-center text-center">
            <div ref={avatarRef} className="relative mb-5">
              <div data-avatar-ring className={`absolute inset-0 -m-2 rounded-full bg-gradient-to-r ${config.gradient} opacity-40 blur-md`} />

              <div className={`relative h-28 w-28 overflow-hidden rounded-full border-4 border-background transition-transform duration-500 group-hover:scale-110 md:h-32 md:w-32`}>
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="128px" />
                ) : (
                  <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${config.gradient}`}>
                    <span className="font-heading text-3xl font-black text-white drop-shadow-lg md:text-4xl">{initials}</span>
                  </div>
                )}
              </div>

              <div className={`absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br ${config.gradient}`}>
                <DepartmentIcon className="h-5 w-5 text-white" />
              </div>
            </div>

            <Badge variant="outline" className={`mb-3 ${config.badge}`}>
              <Star className="mr-1 h-3 w-3" />
              {member.department}
            </Badge>

            <h2 className="mb-1 font-heading text-xl font-black md:text-2xl">{member.name}</h2>

            <p className="mb-4 text-sm font-semibold text-primary">{member.role}</p>

            <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>

            <div className="mb-5 flex flex-wrap justify-center gap-1.5">
              {member.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  data-tag
                  className="rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  {tag}
                </span>
              ))}
              {member.tags.length > 4 && (
                <span data-tag className="rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                  +{member.tags.length - 4}
                </span>
              )}
            </div>

            <div className="mb-6 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-heading text-xl font-black text-foreground">{isVisible ? <AnimatedNumber value={member.stats.projects} delay={index * 100} /> : '0'}</span>
                </div>
                <p className="text-xs text-muted-foreground">Proyectos</p>
              </div>

              <div className="h-8 w-px bg-border" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4 text-secondary" />
                  <span className="font-heading text-xl font-black text-foreground">{isVisible ? <AnimatedNumber value={member.stats.experience} delay={index * 100 + 200} /> : '0'}</span>
                </div>
                <p className="text-xs text-muted-foreground">Experiencia</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {member.socials.map((social) => {
                const SocialIcon = socialIcons[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:bg-primary hover:text-white"
                    aria-label={social.platform}
                  >
                    <SocialIcon className="h-4 w-4" />
                  </a>
                );
              })}

              <a
                href={`mailto:contacto@redorange.net.pe`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:bg-primary hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 bg-muted/20 px-6 py-4 backdrop-blur-sm md:px-8">
          <Button asChild variant="ghost" className="w-full font-heading group/btn">
            <Link href={`/team/${member.id}`}>
              <span className="flex items-center justify-center gap-2">
                Ver perfil completo
                <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const TeamGrid: FC<TeamGridProps> = ({ members }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    animate(container.querySelectorAll('[data-team="glow"]'), {
      translateY: [0, 20, 0],
      translateX: [0, 10, 0],
      scale: [1, 1.1, 1],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 6000,
      delay: stagger(1000),
    });

    const headerEls = headerRef.current?.querySelectorAll('[data-team="header"]') ?? [];
    animate(headerEls, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: stagger(100),
    });

    const cardEls = gridRef.current?.querySelectorAll('[data-team="card"]') ?? [];
    animate(cardEls, {
      opacity: [0, 1],
      translateY: [50, 0],
      rotateX: [10, 0],
      duration: 1200,
      easing: 'easeOutExpo',
      delay: stagger(150, { start: 400 }),
    });

    animate(container.querySelectorAll('[data-team="cta"]'), {
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.9, 1],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 1200,
    });
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div data-team="glow" className="absolute -left-60 top-20 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary/20 to-secondary/10 blur-3xl" />
        <div data-team="glow" className="absolute -right-60 top-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-secondary/20 to-accent/10 blur-3xl" />
        <div data-team="glow" className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-t from-primary/15 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div ref={headerRef} className="mb-16 text-center md:mb-20">
          <div data-team="header" className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-2 backdrop-blur-sm opacity-0">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Conoce a nuestro equipo</span>
          </div>

          <h1 data-team="header" className="mb-6 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl opacity-0">
            El talento detrás de <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Red Orange</span>
          </h1>

          <p data-team="header" className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg opacity-0">
            Profesionales apasionados por la tecnología, comprometidos con la excelencia y dedicados a transformar organizaciones a través de soluciones innovadoras.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:gap-10">
          {members.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} />
          ))}
        </div>

        <div data-team="cta" className="mt-20 text-center opacity-0">
          <div className="relative inline-block">
            <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 p-8 backdrop-blur-xl md:p-12">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-secondary/20 to-transparent blur-2xl" />

              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>

                <h3 className="mb-3 font-heading text-2xl font-black md:text-3xl">¿Quieres ser parte del equipo?</h3>

                <p className="mb-6 text-muted-foreground">Estamos siempre buscando talento apasionado por la tecnología y la innovación.</p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="font-heading group">
                    <Link href="/#contact">
                      Contáctanos
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>

                  <Button asChild size="lg" variant="outline" className="font-heading">
                    <Link href="/#services">Ver servicios</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
