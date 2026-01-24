'use server';

import type { ApiResponse, HeroData } from '@/app/(infra)/infra/_components/types';

export const getInfraHero = async (): Promise<ApiResponse<HeroData>> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const data: HeroData = {
    badge: 'Equipos y Tecnología',
    tags: ['Importación', 'Comercialización', 'Soporte'],
    title: 'Comercialización e',
    titleHighlight: 'Importación de Equipos',
    description: 'Importación, distribución y comercialización de equipos de cómputo, accesorios, telecomunicaciones y robótica. Servicios técnicos especializados con garantía.',
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
