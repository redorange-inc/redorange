'use client';

import { useEffect, useState } from 'react';
import { ui, getIcon } from './constants';
import type { ServiceItemResponse } from './types';

interface ServicesCarouselProps {
  services: ServiceItemResponse['items'];
}

export const ServicesCarousel = ({ services }: ServicesCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = services.length;

  useEffect(() => {
    if (totalSlides === 0) return;
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % totalSlides), 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <div className={`rounded-3xl ${ui.glassCard} relative`}>
      <div className="pt-0">
        <div className="relative overflow-hidden min-h-[80px]">
          {services.map((item, idx) => (
            <div
              key={idx}
              className={`transition-all duration-500 ${idx === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5 absolute inset-0'}`}
              style={{ display: idx === currentSlide ? 'block' : 'none' }}
            >
              <div className={`group flex items-center gap-4 rounded-2xl ${ui.softBorder} bg-background/40 p-5 backdrop-blur ${ui.hoverLift}`}>
                <div className="rounded-xl bg-tech p-3 text-tech transition-all group-hover:scale-110">{getIcon(item.iconName)}</div>
                <div className="text-base font-medium text-foreground">{item.text}</div>
              </div>
            </div>
          ))}

          {totalSlides > 0 && (
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-tech' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
