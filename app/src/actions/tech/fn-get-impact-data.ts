'use server';

import type { ApiResponse, ImpactDataResponse } from '@/app/(tech)/tech/_components/types';

export const getImpactData = async (): Promise<ApiResponse<ImpactDataResponse>> => {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data - simula respuesta del backend
  const mockData: ImpactDataResponse = {
    items: [
      { area: 'Desarrollo', value: 92 },
      { area: 'Infraestructura', value: 88 },
      { area: 'Redes', value: 76 },
      { area: 'Soporte', value: 95 },
      { area: 'Automatización', value: 84 },
      { area: 'Capacitación', value: 71 },
    ],
  };

  return {
    data: mockData,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'mock-database',
    },
    message: 'Impact data retrieved successfully',
  };
};
