'use client';

import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isActive = (sectionId: string) => {
    if (pathname === '/team' && sectionId === 'team') return true;
    if (pathname === '/' && activeSection === sectionId) return true;
    return false;
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
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
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-3 py-2 font-heading text-sm transition-all duration-200',
                'hover:text-primary hover:font-bold',
                isActive(item.sectionId) ? 'text-primary font-bold' : 'text-foreground/80',
              )}
            >
              {item.label}
              {isActive(item.sectionId) && <span className="absolute bottom-0 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-primary" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Button asChild className="font-heading">
              <Link href="/#contact">Solicitar cotización</Link>
            </Button>
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/60 backdrop-blur transition-colors hover:bg-muted lg:hidden"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />}

      <div
        className={cn(
          'fixed inset-x-0 top-[61px] z-50 max-h-[calc(100vh-61px)] overflow-y-auto bg-background border-b border-border shadow-xl transition-all duration-300 lg:hidden',
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none',
        )}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col px-6 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'relative py-3 font-heading text-base transition-all duration-200 border-b border-border/30',
                'hover:text-primary hover:pl-2',
                isActive(item.sectionId) ? 'text-primary font-bold pl-2' : 'text-foreground/80',
              )}
            >
              {isActive(item.sectionId) && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
              {item.label}
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-border/50">
            <Button asChild className="w-full font-heading">
              <Link href="/#contact" onClick={handleNavClick}>
                Solicitar cotización
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
