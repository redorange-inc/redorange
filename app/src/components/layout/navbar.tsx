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
  { href: '/#home', label: 'Inicio', sectionId: 'home' },
  { href: '/#services', label: 'Líneas', sectionId: 'services' },
  { href: '/#about', label: 'Sobre Nosotros', sectionId: 'about' },
  { href: '/team', label: 'Nuestro Equipo', sectionId: 'team' },
  { href: '/#contact', label: 'Contactarnos', sectionId: 'contact' },
] as const;

export const Navbar: FC = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('home');

  const handleScroll = useCallback(() => {
    if (pathname !== '/') return;

    const sections = ['home', 'services', 'about', 'contact'];
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
    if (pathname === '/team') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection('team');
      return;
    }

    if (pathname === '/') {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pathname, handleScroll]);

  const isActive = (sectionId: string) => {
    if (pathname === '/team' && sectionId === 'team') return true;
    if (pathname === '/' && activeSection === sectionId) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/#home" className="flex items-center gap-2">
          <Image src="/img/logo.webp" alt="Red Orange" width={36} height={36} className="rounded-md" priority />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-extrabold tracking-tight">Red Orange</span>
            <span className="text-xs text-muted-foreground">E.I.R.L.</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" className={cn('relative px-3 font-heading text-sm transition-colors', isActive(item.sectionId) && 'text-primary')}>
              <Link href={item.href}>
                {item.label}
                {isActive(item.sectionId) && <span className="absolute bottom-0 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-primary" />}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Button asChild className="font-heading">
              <Link href="/#contact">Solicitar cotización</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-3 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Button key={item.href} asChild size="sm" variant={isActive(item.sectionId) ? 'default' : 'secondary'} className="font-heading text-xs">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};
