'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Monitor, Keyboard, Cable, Router, Cpu, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProductsData, ProductCategory } from './types';

interface ProductsCarouselProps {
  products: ProductsData;
}

const iconMap: Record<string, React.ElementType> = {
  monitor: Monitor,
  keyboard: Keyboard,
  cable: Cable,
  router: Router,
  cpu: Cpu,
};

export const ProductsCarousel = ({ products }: ProductsCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold lg:text-3xl">Nuestros Productos</h2>
          <p className="text-muted-foreground">Equipos y soluciones tecnológicas de calidad</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll('left')} className="hidden sm:flex border-infra/30 hover:bg-infra/10">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll('right')} className="hidden sm:flex border-infra/30 hover:bg-infra/10">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {products.categories.map((category) => (
          <ProductCard key={category.id} category={category} />
        ))}
      </div>

      <div className="flex justify-center">
        <Button asChild variant="outline" className="font-heading border-infra/30 hover:bg-infra/10">
          <Link href="/infra/products">
            Ver Todos los Productos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ProductCard = ({ category }: { category: ProductCategory }) => {
  const IconComponent = iconMap[category.iconName] || Monitor;

  return (
    <Card className="min-w-[300px] max-w-[300px] snap-start border-infra/20 transition-all hover:border-infra/40 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-infra/10">
            <IconComponent className="h-6 w-6 text-infra" />
          </div>
          {category.featured && <Badge className="bg-infra/10 text-infra border-infra/30">Destacado</Badge>}
        </div>
        <CardTitle className="font-heading text-lg">{category.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {category.items.slice(0, 4).map((item, index) => (
            <span key={index} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {item}
            </span>
          ))}
          {category.items.length > 4 && <span className="rounded-full bg-infra/10 px-2 py-0.5 text-xs text-infra">+{category.items.length - 4} más</span>}
        </div>
        <Button asChild variant="ghost" size="sm" className="w-full text-infra hover:bg-infra/10">
          <Link href={`/infra/products#${category.id}`}>
            Ver categoría
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
