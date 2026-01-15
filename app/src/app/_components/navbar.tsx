'use client';

import { type FC, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Menu, X, Home, Package, Info, Mail } from 'lucide-react';

const navItems = [
  { href: '/#home', label: 'Inicio', icon: Home },
  { href: '/#services', label: 'Lineas', icon: Package },
  { href: '/#about', label: 'Sobre Nosotros', icon: Info },
  { href: '/#contact', label: 'Contactarnos', icon: Mail },
] as const;

export const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
        <div className="rounded-2xl bg-background/70 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
            <Link href="/#home" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <Image src="/img/logo.webp" alt="Red Orange" width={36} height={36} className="rounded-lg md:h-10 md:w-10" />
              <div className="flex flex-col leading-none">
                <span className="font-heading text-sm font-bold tracking-tight md:text-base">Red Orange</span>
                <span className="text-[10px] text-muted-foreground md:text-xs">E.I.R.L.</span>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Button key={item.href} asChild variant="ghost" className="px-4 font-heading text-sm font-medium">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block">
                <Button asChild className="font-heading font-semibold">
                  <Link href="/#contact">Solicitar cotización</Link>
                </Button>
              </div>
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)}>
          <div className="fixed right-0 top-0 z-70 h-full w-80 bg-background shadow-2xl rounded-l-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-6 py-6">
                <div className="flex items-center gap-2.5">
                  <Image src="/img/logo.webp" alt="Red Orange" width={36} height={36} className="rounded-lg" />
                  <div className="flex flex-col leading-none">
                    <span className="font-heading text-base font-bold tracking-tight">Red Orange</span>
                    <span className="text-xs text-muted-foreground">E.I.R.L.</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-muted">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex flex-col gap-2 px-4 py-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant="ghost"
                      className="justify-start gap-3 font-heading text-base font-medium h-14 rounded-xl hover:bg-muted/80 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={item.href}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>

              <div className="mt-auto p-6">
                <Button asChild className="w-full h-12 font-heading font-semibold rounded-xl shadow-sm" onClick={() => setIsOpen(false)}>
                  <Link href="/#contact">Solicitar cotización</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
