'use server';

import type { ApiResponse, FutureResponse } from '@/app/(tech)/tech/projects/_components/types';

export const getFutureTech = async (): Promise<ApiResponse<FutureResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: FutureResponse = {
    items: [
      {
        name: 'Rust',
        description: 'Implementación de servicios críticos con máximo rendimiento y seguridad de memoria.',
        expectedDate: '2025',
        iconName: 'Shield',
      },
      {
        name: 'WebAssembly',
        description: 'Ejecución de código de alto rendimiento en navegadores para aplicaciones complejas.',
        expectedDate: '2025',
        iconName: 'Cpu',
      },
      {
        name: 'Kubernetes',
        description: 'Orquestación de contenedores para escalabilidad y alta disponibilidad.',
        expectedDate: '2025',
        iconName: 'Cloud',
      },
    ],
  };

  return {
    data: mockData,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'mock-database',
    },
  };
};
