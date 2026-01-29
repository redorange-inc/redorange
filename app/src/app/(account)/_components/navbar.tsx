'use client';

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Shield, Monitor } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { cn } from '@/lib/utils';
import { UserButton } from '@/components/auth/user-button';

const navItems = [
  { href: '/account/profile', label: 'Mi Perfil', icon: User },
  { href: '/account/security', label: 'Seguridad', icon: Shield },
  { href: '/account/sessions', label: 'Sesiones', icon: Monitor },
] as const;

export const Navbar: FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
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
            <span className="text-xs text-muted-foreground">Mi Cuenta</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-2 font-heading text-sm transition-all duration-200 rounded-md',
                  'hover:bg-muted',
                  active ? 'text-primary font-semibold bg-primary/10' : 'text-foreground/80',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <UserButton showName={false} />
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/60 backdrop-blur transition-colors hover:bg-muted md:hidden"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />}

      <div
        className={cn(
          'fixed inset-x-0 top-[61px] z-50 max-h-[calc(100vh-61px)] overflow-y-auto bg-background border-b border-border shadow-xl transition-all duration-300 md:hidden',
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none',
        )}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col px-6 py-4">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'relative flex items-center gap-3 py-3 font-heading text-base transition-all duration-200 border-b border-border/30',
                  'hover:text-primary hover:pl-2',
                  active ? 'text-primary font-bold pl-2' : 'text-foreground/80',
                )}
              >
                {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Mi cuenta</span>
            <UserButton showName={true} />
          </div>
        </nav>
      </div>
    </header>
  );
};
