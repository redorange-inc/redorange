'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

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
                className={cn(
                  'relative px-3 py-2 font-heading text-sm transition-all duration-200',
                  'hover:text-tech hover:font-bold',
                  active ? 'text-tech font-bold' : 'text-foreground/80'
                )}
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
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-3 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const active = isActive(item);

            return (
              <Button
                key={item.href}
                asChild
                size="sm"
                variant={active ? 'default' : 'secondary'}
                className={cn('font-heading text-xs', active && 'bg-tech text-white hover:bg-tech-accent')}
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
