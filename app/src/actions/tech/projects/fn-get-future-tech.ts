'use server';

import type { ApiResponse, FutureResponse } from '@/app/(tech)/tech/projects/_components/types';

export const getFutureTech = async (): Promise<ApiResponse<FutureResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: FutureResponse = {
    items: [
      { name: 'Rust', description: 'Lenguaje de sistemas para servicios de alto rendimiento y seguridad de memoria', expectedDate: 'Q2 2025', iconName: 'rust' },
      { name: 'WebAssembly', description: 'Ejecución de código de alto rendimiento en navegadores y edge computing', expectedDate: 'Q3 2025', iconName: 'webassembly' },
      { name: 'Kubernetes', description: 'Orquestación de contenedores para despliegues a escala', expectedDate: 'Q4 2025', iconName: 'kubernetes' },
    ],
  };

  return {
    data: mockData,
    meta: { timestamp: new Date().toISOString(), source: 'mock-database' },
  };
};
