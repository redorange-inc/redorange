'use client';

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/tech', label: 'Inicio', exact: true },
  { href: '/tech/services', label: 'Servicios', exact: false },
  { href: '/tech/projects', label: 'Proyectos', exact: false },
  { href: '/tech/method', label: 'Metodología', exact: false },
  { href: '/tech/contact', label: 'Contacto', exact: false },
] as const;

export const Navbar: FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/img/logo.webp" alt="REDORANGE" width={36} height={36} className="rounded-md" priority />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-extrabold tracking-tight">REDORANGE</span>
            <span className="text-xs text-muted-foreground">Tech</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('relative px-3 py-2 font-heading text-sm transition-all duration-200', 'hover:text-tech hover:font-bold', active ? 'text-tech font-bold' : 'text-foreground/80')}
              >
                {item.label}
                {active && <span className="absolute bottom-0 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-tech" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Button asChild className="font-heading bg-tech-muted text-white hover:bg-tech-accent">
              <Link href="/auth/sign-in">Iniciar Sesión</Link>
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

      <div
        className={cn(
          'fixed inset-x-0 top-[61px] bottom-0 z-40 bg-background/95 backdrop-blur-lg transition-all duration-300 lg:hidden',
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
        )}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6">
          {navItems.map((item) => {
            const active = isActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'relative py-3 font-heading text-base transition-all duration-200 border-b border-border/30',
                  'hover:text-tech hover:pl-2',
                  active ? 'text-tech font-bold pl-2' : 'text-foreground/80',
                )}
              >
                {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-tech" />}
                {item.label}
              </Link>
            );
          })}

          <div className="mt-6 pt-4 border-t border-border/50">
            <Button asChild className="w-full font-heading bg-tech-muted text-white hover:bg-tech-accent">
              <Link href="/auth/sign-in" onClick={() => setIsMenuOpen(false)}>
                Iniciar Sesión
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
