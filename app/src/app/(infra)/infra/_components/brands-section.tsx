'use client';

import type { BrandsData } from './types';

interface BrandsSectionProps {
  brands: BrandsData;
}

export const BrandsSection = ({ brands }: BrandsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold lg:text-3xl">Marcas y Proveedores</h2>
        <p className="text-muted-foreground mt-2">Trabajamos con las mejores marcas del mercado</p>
      </div>

      <div className="relative overflow-hidden py-4">
        <div className="flex animate-marquee gap-8">
          {[...brands.items, ...brands.items].map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex h-16 min-w-[120px] items-center justify-center rounded-lg border border-infra/10 bg-background/50 px-6 transition-all hover:border-infra/30 hover:bg-infra/5"
            >
              <span className="font-heading font-semibold text-muted-foreground hover:text-infra transition-colors">{brand.name}</span>
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
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
