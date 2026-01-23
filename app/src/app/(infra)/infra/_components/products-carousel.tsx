'use client';

import { useRef, useState, useEffect } from 'react';
import { Monitor, Keyboard, HardDrive, Router, Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ProductsPreviewData } from './types';

interface ProductsCarouselProps {
  products: ProductsPreviewData;
}

const iconMap: Record<string, React.ElementType> = {
  monitor: Monitor,
  keyboard: Keyboard,
  hardDrive: HardDrive,
  router: Router,
  cpu: Cpu,
};

export const ProductsCarousel = ({ products }: ProductsCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <div ref={scrollRef} className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {products.items.map((product) => {
          const IconComponent = iconMap[product.iconName] || Monitor;

          return (
            <Card key={product.id} className="min-w-full snap-start border-none bg-linear-to-br from-infra/5 via-transparent to-transparent">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-infra/10">
                  <IconComponent className="h-6 w-6 text-infra" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {products.items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              scrollRef.current?.scrollTo({
                left: index * (scrollRef.current?.offsetWidth || 0),
                behavior: 'smooth',
              });
            }}
            className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-infra' : 'w-2 bg-infra/30'}`}
          />
        ))}
      </div>
    </div>
  );
};
