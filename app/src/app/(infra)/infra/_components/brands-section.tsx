'use client';

import type { BrandsData } from './types';

interface BrandsSectionProps {
  brands: BrandsData;
}

export const BrandsSection = ({ brands }: BrandsSectionProps) => {
  return (
    <div className="space-y-6" data-anim="fade-up">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold">{brands.title}</h2>
        <p className="text-muted-foreground mt-1">{brands.subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {brands.items.map((brand) => (
          <div key={brand.id} className="flex h-14 min-w-[100px] items-center justify-center rounded-lg border border-infra/15 bg-background/50 px-6 transition-all hover:border-infra/40 hover:bg-infra/5">
            <span className="font-heading font-semibold text-muted-foreground hover:text-infra transition-colors">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
