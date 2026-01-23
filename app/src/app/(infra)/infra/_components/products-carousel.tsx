'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Monitor, Keyboard, HardDrive, Router, Cpu } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  const items = products.items;
  const len = items.length;

  const slides = useMemo(() => {
    if (len === 0) return [];
    if (len === 1) return [items[0]];
    return [items[len - 1], ...items, items[0]];
  }, [items, len]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [, setPageIndex] = useState(len > 1 ? 1 : 0);

  const scrollToPage = (index: number, behavior: ScrollBehavior) => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.offsetWidth || 0;
    el.scrollTo({ left: index * w, behavior });
  };

  useEffect(() => {
    if (len <= 1) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageIndex(1);
    setActiveIndex(0);
    requestAnimationFrame(() => scrollToPage(1, 'auto'));
  }, [len]);

  useEffect(() => {
    if (len <= 1) return;

    const id = window.setInterval(() => {
      setPageIndex((prev) => {
        const next = prev + 1;
        scrollToPage(next, 'smooth');
        return next;
      });
    }, 3000);

    return () => window.clearInterval(id);
  }, [len]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || len <= 1) return;

    let raf = 0;
    let settleTimer: number | undefined;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.offsetWidth || 1;
        const rawPage = Math.round(el.scrollLeft / w);

        setPageIndex(rawPage);

        const real = (((rawPage - 1) % len) + len) % len;
        setActiveIndex(real);

        if (settleTimer) window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          if (rawPage === 0) {
            el.scrollTo({ left: len * w, behavior: 'auto' });
            setPageIndex(len);
            setActiveIndex(len - 1);
          }

          if (rawPage === len + 1) {
            el.scrollTo({ left: 1 * w, behavior: 'auto' });
            setPageIndex(1);
            setActiveIndex(0);
          }
        }, 120);
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      if (settleTimer) window.clearTimeout(settleTimer);
    };
  }, [len]);

  if (len === 0) return null;

  const renderSlides = len === 1 ? items : slides;

  const goToRealIndex = (realIndex: number) => {
    if (len <= 1) return;
    const targetPage = realIndex + 1;
    setActiveIndex(realIndex);
    setPageIndex(targetPage);
    scrollToPage(targetPage, 'smooth');
  };

  return (
    <div className="relative">
      <div ref={containerRef} className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {renderSlides.map((product, i) => {
          const IconComponent = iconMap[product.iconName] || Monitor;

          return (
            <div key={`${product.id}-${i}`} className="min-w-full snap-start rounded-2xl p-1px bg-linear-to-br from-infra-accent/18 via-infra-muted/8 to-transparent">
              <div className="flex items-center gap-4 p-5 rounded-2xl backdrop-blur-sm bg-linear-to-br from-infra-accent/10 to-infra-muted/6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-infra/10">
                  <IconComponent className="h-6 w-6 text-infra" />
                </div>

                <div>
                  <h3 className="font-heading font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {len > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToRealIndex(index)}
              className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-infra' : 'w-2 bg-infra/30'}`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
