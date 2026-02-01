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
  { href: '/clients', label: 'Clientes', sectionId: 'clients' },
  { href: '/#contact', label: 'Contacto', sectionId: 'contact' },
] as const;

export const Navbar: FC = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);

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

    if (pathname === '/clients') {
      setActiveSection('clients');
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
    if (pathname === '/clients' && sectionId === 'clients') return true;
    if (pathname === '/' && activeSection === sectionId) return true;
    return false;
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-100 w-full transition-all duration-300', 'border-b border-border/70 bg-background', isScrolled && 'shadow-sm')}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <Link href="/#home" className="flex items-center gap-2 shrink-0">
          <Image src="/img/logo.webp" alt="Red Orange" width={36} height={36} className="rounded-md w-8 h-8 sm:w-9 sm:h-9" priority />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-extrabold tracking-tight">Red Orange</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">E.I.R.L.</span>
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
            <Button asChild className="font-heading" size="sm">
              <Link href="/#contact">Solicitar cotización</Link>
            </Button>
          </div>

          <div className="relative z-110">
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'relative z-110 flex h-10 w-10 items-center justify-center rounded-lg',
              'border border-border/60 bg-background',
              'transition-all duration-200 hover:bg-muted active:scale-95',
              'lg:hidden',
            )}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            <div className="relative w-5 h-5">
              <Menu className={cn('absolute inset-0 h-5 w-5 transition-all duration-300', isMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100')} />
              <X className={cn('absolute inset-0 h-5 w-5 transition-all duration-300', isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50')} />
            </div>
          </button>
        </div>
      </div>

      <div className={cn('fixed inset-0 top-[61px] z-90 bg-background lg:hidden', 'transition-all duration-300 ease-out', isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}>
        <nav className="flex h-full w-full flex-col px-4 py-6 sm:px-6">
          <div className="flex-1 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'relative flex items-center py-4 font-heading text-lg transition-all duration-200',
                  'border-b border-border/30',
                  'hover:text-primary hover:pl-4',
                  'active:bg-muted/50',
                  isActive(item.sectionId) ? 'text-primary font-bold pl-4' : 'text-foreground/80',
                )}
                style={{
                  animationDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                {isActive(item.sectionId) && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary" />}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-border/50 space-y-4">
            <Button asChild className="w-full font-heading" size="lg">
              <Link href="/#contact" onClick={handleNavClick}>
                Solicitar cotización
              </Link>
            </Button>

            <p className="text-xs text-center text-muted-foreground">Usa el botón de tema arriba para cambiar entre claro y oscuro</p>
          </div>
        </nav>
      </div>
    </header>
  );
};
