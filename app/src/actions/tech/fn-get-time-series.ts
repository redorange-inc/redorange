'use server';

import type { ApiResponse, TimeSeriesResponse } from '@/app/(tech)/tech/_components/types';

export const getTimeSeries = async (): Promise<ApiResponse<TimeSeriesResponse>> => {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Mock data - simula respuesta del backend
  const mockData: TimeSeriesResponse = {
    items: [
      { month: 'Ene', rendimiento: 78, satisfaccion: 85 },
      { month: 'Feb', rendimiento: 82, satisfaccion: 88 },
      { month: 'Mar', rendimiento: 85, satisfaccion: 90 },
      { month: 'Abr', rendimiento: 79, satisfaccion: 82 },
      { month: 'May', rendimiento: 88, satisfaccion: 92 },
      { month: 'Jun', rendimiento: 91, satisfaccion: 94 },
      { month: 'Jul', rendimiento: 93, satisfaccion: 95 },
      { month: 'Ago', rendimiento: 90, satisfaccion: 91 },
      { month: 'Sep', rendimiento: 94, satisfaccion: 96 },
      { month: 'Oct', rendimiento: 96, satisfaccion: 97 },
      { month: 'Nov', rendimiento: 95, satisfaccion: 96 },
      { month: 'Dic', rendimiento: 98, satisfaccion: 99 },
    ],
  };

  return {
    data: mockData,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'mock-database',
    },
    message: 'Time series data retrieved successfully',
  };
};
