'use client';

import type { BrandsData } from './types';

interface BrandsSectionProps {
  brands: BrandsData;
}

export const BrandsSection = ({ brands }: BrandsSectionProps) => {
  // Duplicamos las marcas para el efecto infinito
  const duplicatedBrands = [...brands.items, ...brands.items];

  return (
    <div className="space-y-6" data-anim="fade-up">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold">{brands.title}</h2>
        <p className="text-muted-foreground mt-1">{brands.subtitle}</p>
      </div>

      <div className="relative overflow-hidden">
        {/* Gradient masks */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

        {/* Marquee container */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex h-14 min-w-[120px] flex-shrink-0 mx-2 items-center justify-center rounded-lg border border-infra/15 bg-background/70 backdrop-blur-sm px-6 transition-all hover:border-infra/40 hover:bg-infra/5"
            >
              <span className="font-heading font-semibold text-muted-foreground whitespace-nowrap">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};
