'use client';

import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/tech/#inicio', label: 'Inicio', sectionId: 'inicio' },
  { href: '/tech/#servicios', label: 'Servicios', sectionId: 'servicios' },
  { href: '/tech/#proyectos', label: 'Proyectos', sectionId: 'proyectos' },
  { href: '/tech/#metodologia', label: 'Metodología', sectionId: 'metodologia' },
  { href: '/tech/#contacto', label: 'Contacto', sectionId: 'contacto' },
] as const;

export const Navbar: FC = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('inicio');

  const handleScroll = useCallback(() => {
    if (pathname !== '/tech') return;

    const sections = ['inicio', 'servicios', 'proyectos', 'metodologia', 'contacto'];
    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(sections[i]);
        break;
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/tech') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pathname, handleScroll]);

  const isActive = (sectionId: string) => pathname === '/tech' && activeSection === sectionId;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo -> Home */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/img/logo.webp" alt="REDORANGE" width={36} height={36} className="rounded-md" priority />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-extrabold tracking-tight">REDORANGE</span>
            <span className="text-xs text-muted-foreground">Tech</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.sectionId);

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn('relative px-3 font-heading text-sm transition-colors', 'hover:text-cyan-600 dark:hover:text-cyan-400', active && 'text-cyan-600 dark:text-cyan-400')}
              >
                <Link href={item.href}>
                  {item.label}
                  {active && <span className="absolute bottom-0 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-cyan-600 dark:bg-cyan-400" />}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block ">
            <Button
              asChild
              className={cn(
                'font-heading',
                'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950',
                'hover:bg-cyan-700 hover:text-white dark:hover:bg-cyan-300 dark:hover:text-slate-950',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
              )}
            >
              <Link href="/auth/sign-in">Iniciar Sesión</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-3 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const active = isActive(item.sectionId);

            return (
              <Button
                key={item.href}
                asChild
                size="sm"
                variant={active ? 'default' : 'secondary'}
                className={cn('font-heading text-xs', 'hover:text-cyan-600 dark:hover:text-cyan-400', active && 'text-cyan-600 dark:text-cyan-400')}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
