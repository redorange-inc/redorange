'use server';

import type { ApiResponse, ImpactData } from '@/app/(infra)/infra/_components/types';

export const getInfraImpactData = async (): Promise<ApiResponse<ImpactData>> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const data: ImpactData = {
    title: 'Distribución de Ventas',
    subtitle: 'Por categoría de producto',
    items: [
      { name: 'Equipos de Cómputo', value: 42, color: '#f43f5e' },
      { name: 'Accesorios', value: 23, color: '#fb7185' },
      { name: 'Telecomunicaciones', value: 18, color: '#fda4af' },
      { name: 'Suministros', value: 12, color: '#fecdd3' },
      { name: 'Robótica', value: 5, color: '#ffe4e6' },
    ],
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
