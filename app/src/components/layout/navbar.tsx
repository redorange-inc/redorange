'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/#home', label: 'Inicio' },
  { href: '/#services', label: 'Líneas' },
  { href: '/#about', label: 'Sobre Nosotros' },
  { href: '/team', label: 'Nuestro Equipo' },
  { href: '/#contact', label: 'Contactarnos' },
] as const;

export const Navbar: FC = () => {
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
            <Button key={item.href} asChild variant="ghost" className="px-3 font-heading text-sm">
              <Link href={item.href}>{item.label}</Link>
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
            <Button key={item.href} asChild size="sm" variant="secondary" className="font-heading text-xs">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};
