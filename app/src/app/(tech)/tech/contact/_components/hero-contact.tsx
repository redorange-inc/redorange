'use client';

import { DynamicIcon } from 'lucide-react/dynamic';
import { Badge } from '@/components/ui/badge';

interface HeroContactProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
}

export const HeroContact = ({ badge, title, subtitle, description }: HeroContactProps) => {
  return (
    <section data-anim="fade-up" className="mb-10 text-center">
      <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs mb-4">
        <Badge className="rounded-full bg-background/60 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105">
          <DynamicIcon name="sparkles" size={14} className="mr-1 text-tech animate-pulse" />
          {badge}
        </Badge>
        <Badge className="rounded-full bg-tech-solid">{subtitle}</Badge>
      </div>

      <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">{title}</h1>

      <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">{description}</p>
    </section>
  );
};
