'use server';

import type { ApiResponse, TimeSeriesData } from '@/app/(infra)/infra/_components/types';

export const getInfraTimeSeries = async (): Promise<ApiResponse<TimeSeriesData>> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const data: TimeSeriesData = {
    title: 'Tendencia anual',
    subtitle: 'Evolución de métricas clave 2025',
    items: [
      { month: 'Ene', ventas: 65, importaciones: 45 },
      { month: 'Feb', ventas: 72, importaciones: 52 },
      { month: 'Mar', ventas: 68, importaciones: 48 },
      { month: 'Abr', ventas: 78, importaciones: 55 },
      { month: 'May', ventas: 82, importaciones: 60 },
      { month: 'Jun', ventas: 88, importaciones: 65 },
      { month: 'Jul', ventas: 85, importaciones: 62 },
      { month: 'Ago', ventas: 92, importaciones: 70 },
      { month: 'Sep', ventas: 95, importaciones: 72 },
      { month: 'Oct', ventas: 98, importaciones: 78 },
      { month: 'Nov', ventas: 102, importaciones: 82 },
      { month: 'Dic', ventas: 108, importaciones: 88 },
    ],
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
