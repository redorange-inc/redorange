'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { animate, stagger } from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Instagram, Facebook, Twitter, Clock, Sparkles, ArrowRight, Rocket, Code2, Building2, Palette, Terminal, Mail, Star, Zap, Users, Boxes, Target, Award } from 'lucide-react';
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

const AnimatedNumber: FC<{ value: string; delay?: number; isVisible: boolean }> = ({ value, delay = 0, isVisible }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    const numericMatch = value.match(/^(\d+)/);
    if (!numericMatch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(numericMatch[1], 10);
    const suffix = value.replace(/^\d+/, '');

    const timeout = setTimeout(() => {
      hasAnimated.current = true;
      const duration = 1500;
      const startTime = Date.now();

      const updateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(targetNum * eased);

        setDisplayValue(`${current}${suffix}`);

        if (progress < 1) requestAnimationFrame(updateNumber);
      };

      requestAnimationFrame(updateNumber);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay, isVisible]);

  return <span>{displayValue}</span>;
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
    const ringElement = avatarRef.current?.querySelector('[data-avatar-ring]');
    if (!ringElement) return;

    const animation = animate(ringElement, { scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4], duration: 3000, easing: 'easeInOutSine', loop: true, delay: index * 200 });

    return () => {
      animation.pause();
    };
  }, [index]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (!cardRef.current || !isHovered) return;

    const tags = cardRef.current.querySelectorAll('[data-tag]');
    if (tags.length === 0) return;

    animate(tags, { translateY: [5, 0], opacity: [0.7, 1], duration: 300, easing: 'easeOutExpo', delay: stagger(30) });
  }, [isHovered]);

  return (
    <div ref={cardRef} data-team="card" className="group relative opacity-0" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-500 hover:border-primary/30">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-muted/30" />

        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-linear-to-br from-primary/10 to-transparent blur-2xl transition-transform duration-700 group-hover:scale-150" />
        <div className="absolute -left-16 -bottom-16 h-32 w-32 rounded-full bg-linear-to-tr from-secondary/10 to-transparent blur-2xl transition-transform duration-700 group-hover:scale-150" />

        <div className="relative flex h-full flex-col px-4 py-5 md:px-5 md:py-6">
          <div className="flex flex-col items-center text-center">
            <div ref={avatarRef} className="relative mb-3">
              <div data-avatar-ring className={`absolute inset-0 -m-2 rounded-full bg-linear-to-r ${config.gradient} opacity-40 blur-md`} />

              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-background transition-transform duration-500 group-hover:scale-110 md:h-24 md:w-24">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${config.gradient}`}>
                    <span className="font-heading text-xl font-black text-white md:text-2xl">{initials}</span>
                  </div>
                )}
              </div>

              <div className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-linear-to-br ${config.gradient}`}>
                <DepartmentIcon className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            <Badge variant="outline" className={`mb-2 text-[10px] ${config.badge}`}>
              <Star className="mr-1 h-2.5 w-2.5" />
              {member.department}
            </Badge>

            <h2 className="mb-0.5 font-heading text-sm font-black md:text-base">{member.name}</h2>

            <p className="mb-2 text-[10px] font-semibold text-primary md:text-xs">{member.role}</p>

            <p className="mb-3 text-[10px] leading-relaxed text-muted-foreground md:text-xs">{member.bio}</p>

            <div className="mb-3 flex flex-wrap justify-center gap-1">
              {member.tags.map((tag) => (
                <span
                  key={tag}
                  data-tag
                  className="rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-[9px] font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="font-heading text-base font-black text-foreground">
                    <AnimatedNumber value={member.stats.projects} delay={index * 100} isVisible={isVisible} />
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground">Proyectos</p>
              </div>

              <div className="h-5 w-px bg-border" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 text-secondary" />
                  <span className="font-heading text-base font-black text-foreground">
                    <AnimatedNumber value={member.stats.experience} delay={index * 100 + 200} isVisible={isVisible} />
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground">Experiencia</p>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-1.5">
              {member.socials.map((social) => {
                const SocialIcon = socialIcons[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:bg-primary hover:text-white"
                    aria-label={social.platform}
                  >
                    <SocialIcon className="h-3.5 w-3.5" />
                  </a>
                );
              })}

              <a
                href="mailto:contacto@redorange.net.pe"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:bg-primary hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
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

    const glowEls = container.querySelectorAll('[data-team="glow"]');
    if (glowEls.length > 0) {
      animate(glowEls, { translateY: [0, 20, 0], translateX: [0, 10, 0], scale: [1, 1.1, 1], direction: 'alternate', loop: true, easing: 'easeInOutSine', duration: 6000, delay: stagger(1000) });
    }

    const headerEls = headerRef.current?.querySelectorAll('[data-team="header"]');
    if (headerEls && headerEls.length > 0) {
      animate(headerEls, { opacity: [0, 1], translateY: [30, 0], duration: 1000, easing: 'easeOutExpo', delay: stagger(100) });
    }

    const cardEls = gridRef.current?.querySelectorAll('[data-team="card"]');
    if (cardEls && cardEls.length > 0) {
      animate(cardEls, { opacity: [0, 1], translateY: [50, 0], rotateX: [10, 0], duration: 1200, easing: 'easeOutExpo', delay: stagger(150, { start: 400 }) });
    }

    const ctaEls = container.querySelectorAll('[data-team="cta"]');
    if (ctaEls.length > 0) {
      animate(ctaEls, { opacity: [0, 1], translateY: [30, 0], scale: [0.9, 1], duration: 1000, easing: 'easeOutExpo', delay: 1200 });
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div data-team="glow" className="absolute -left-60 top-20 h-[600px] w-[600px] rounded-full bg-linear-to-r from-primary/20 to-secondary/10 blur-3xl" />
        <div data-team="glow" className="absolute -right-60 top-1/2 h-[500px] w-[500px] rounded-full bg-linear-to-l from-secondary/20 to-accent/10 blur-3xl" />
        <div data-team="glow" className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-linear-to-t from-primary/15 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div ref={headerRef} className="mb-10 text-center md:mb-14">
          <Badge variant="secondary" className="mb-4 font-heading opacity-0" data-team="header">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            Conoce a nuestro equipo
          </Badge>

          <h1 data-team="header" className="mb-3 text-2xl font-black tracking-tight md:text-3xl lg:text-4xl opacity-0">
            El talento detrás de <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">REDORANGE</span>
          </h1>

          <p data-team="header" className="mx-auto max-w-xl text-xs text-muted-foreground md:text-sm opacity-0">
            Profesionales apasionados por la tecnología, comprometidos con la excelencia y dedicados a transformar organizaciones a través de soluciones innovadoras.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {members.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} />
          ))}
        </div>

        <div data-team="cta" className="mt-14 text-center opacity-0">
          <div className="relative inline-block">
            <div className="absolute inset-0 -m-4 rounded-2xl bg-linear-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/80 p-5 backdrop-blur-xl md:p-8">
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-linear-to-br from-primary/20 to-transparent blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-linear-to-tr from-secondary/20 to-transparent blur-2xl" />

              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>

                <h3 className="mb-2 font-heading text-lg font-black md:text-xl">¿Quieres ser parte del equipo?</h3>

                <p className="mb-4 text-xs text-muted-foreground">Estamos siempre buscando talento apasionado por la tecnología y la innovación.</p>

                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                  <Button asChild size="sm" className="font-heading group">
                    <Link href="/#contact">
                      Contáctanos
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>

                  <Button asChild size="sm" variant="outline" className="font-heading">
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
