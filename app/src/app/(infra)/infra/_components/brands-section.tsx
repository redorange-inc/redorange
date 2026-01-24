'use client';

import Image from 'next/image';
import type { BrandsData } from './types';

interface BrandsSectionProps {
  brands: BrandsData;
}

export const BrandsSection = ({ brands }: BrandsSectionProps) => {
  const duplicatedBrands = [...brands.items, ...brands.items];

  return (
    <div className="space-y-6" data-anim="fade-up">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold">{brands.title}</h2>
        <p className="text-muted-foreground mt-1">{brands.subtitle}</p>
      </div>

      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-background to-transparent" />

        <div className="marquee-container flex w-max gap-4">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex h-14 min-w-[140px] shrink-0 items-center justify-center gap-2 rounded-lg border border-infra/15 bg-background/70 backdrop-blur-sm px-4 transition-all hover:border-infra/40 hover:bg-infra/5"
            >
              {brand.icon && <Image src={brand.icon} alt={brand.name} width={24} height={24} className="h-6 w-6 object-contain" />}
              <span className="font-heading font-semibold text-muted-foreground whitespace-nowrap">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-container {
          animation: marquee-scroll 20s linear infinite;
        }

        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
