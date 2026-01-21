'use client';

import React, { useEffect, useState } from 'react';
import { SkeletonServiceCarousel } from './skeletons';
import { ui, getIcon } from './constants';
import { getServices } from '@/actions/tech/fn-get-services';

interface ServiceItemData {
  text: string;
  iconName: string;
}

export const ServicesCarousel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState<ServiceItemData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServices();
        setServices(response.data.items);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading || services.length === 0) return;
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % services.length), 5000);
    return () => clearInterval(interval);
  }, [isLoading, services.length]);

  const totalSlides = services.length;

  return (
    <div className={`rounded-3xl ${ui.glassCard} relative`}>
      <div className="pt-0">
        {isLoading ? (
          <SkeletonServiceCarousel />
        ) : (
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

            {!isLoading && totalSlides > 0 && (
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
        )}
      </div>
    </div>
  );
};
