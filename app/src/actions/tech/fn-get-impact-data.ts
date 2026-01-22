'use server';

import type { ApiResponse, ImpactDataResponse } from '@/app/(tech)/tech/_components/types';

export const getImpactData = async (): Promise<ApiResponse<ImpactDataResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

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
    meta: { timestamp: new Date().toISOString(), source: 'mock-database' },
    message: 'Impact data retrieved successfully',
  };
};
