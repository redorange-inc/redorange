'use server';

import type { ApiResponse, StatsResponse } from '@/app/(tech)/tech/_components/types';

export const getStats = async (): Promise<ApiResponse<StatsResponse>> => {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock data - simula respuesta del backend
  const mockData: StatsResponse = {
    projects: 127,
    clients: 58,
    tickets: 4280,
    uptime: 99.8,
  };

  return {
    data: mockData,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'mock-database',
    },
    message: 'Stats retrieved successfully',
  };
};
