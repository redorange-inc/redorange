'use server';

import type { ApiResponse, StatsData } from '@/app/(infra)/infra/_components/types';

export const getInfraStats = async (): Promise<ApiResponse<StatsData>> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const data: StatsData = {
    title: 'Resumen de Operaciones',
    subtitle: 'Métricas y resultados',
    items: [
      {
        label: 'Equipos Vendidos',
        value: '2,500+',
        change: '+18%',
        trend: 'up',
        iconName: 'monitor',
      },
      {
        label: 'Clientes Empresariales',
        value: '180+',
        change: '+12%',
        trend: 'up',
        iconName: 'building',
      },
      {
        label: 'Importaciones',
        value: '450+',
        change: '+25%',
        trend: 'up',
        iconName: 'globe',
      },
      {
        label: 'Servicios Técnicos',
        value: '3,200+',
        change: '+15%',
        trend: 'up',
        iconName: 'wrench',
      },
    ],
    flexibility: {
      title: 'Modalidad flexible',
      description: 'Venta directa, por volumen o licitación. Adaptamos nuestros servicios a las necesidades de cada cliente.',
    },
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
