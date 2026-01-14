'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/#services', label: 'Servicios' },
  { href: '/#about', label: 'Nosotros' },
  { href: '/#contact', label: 'Contacto' },
] as const;

export const Navbar: FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/*  brand */}
        <Link href="/" className="flex items-center gap-2">
          {/*  logo from public/img/logo.webp */}
          <img src="/img/logo.webp" alt="Red Orange" className="h-9 w-9 rounded-md" />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-sm font-extrabold tracking-tight">Red Orange</span>
            <span className="text-xs text-muted-foreground">E.I.R.L.</span>
          </div>
        </Link>

        {/*  desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" className="px-3 font-heading">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        {/*  actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Button asChild className="font-heading">
              <Link href="/#contact">Solicitar cotización</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/*  mobile quick links */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-3 md:hidden">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Button key={item.href} asChild size="sm" variant="secondary" className="font-heading">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};
