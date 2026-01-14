'use client';

import type { FC } from 'react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback, memo } from 'react';
import { Sun, Moon } from 'lucide-react';

type ThemeKey = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

const isThemeKey = (value: unknown): value is ThemeKey => value === 'light' || value === 'dark' || value === 'system';

const isEffectiveTheme = (value: unknown): value is EffectiveTheme => value === 'light' || value === 'dark';

export const ThemeToggle: FC = memo(() => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Tema "efectivo": si está en system, usamos resolvedTheme
  const effective: EffectiveTheme = (() => {
    if (isEffectiveTheme(theme)) return theme;
    if (isThemeKey(theme) && theme === 'system' && isEffectiveTheme(resolvedTheme)) return resolvedTheme;
    // fallback seguro
    return 'light';
  })();

  const cycleTheme = useCallback(() => {
    // alterna solo entre light y dark, basándose en el efectivo actual
    setTheme(effective === 'dark' ? 'light' : 'dark');
  }, [effective, setTheme]);

  if (!mounted) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <div className="h-5 w-5 animate-pulse rounded-full bg-border" />
      </div>
    );
  }

  const label = effective === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  const Icon = effective === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={[
        'group flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground',
        'transition-all duration-200',
        'hover:-translate-y-px hover:bg-primary hover:text-primary-foreground hover:shadow-md',
        'active:translate-y-0 active:scale-95 active:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      ].join(' ')}
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';
