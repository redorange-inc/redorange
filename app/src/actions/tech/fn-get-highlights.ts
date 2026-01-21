'use server';

import type { ApiResponse, HighlightResponse } from '@/app/(tech)/tech/_components/types';

export const getHighlights = async (): Promise<ApiResponse<HighlightResponse>> => {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - simula respuesta del backend
  const mockData: HighlightResponse = {
    items: [
      { title: 'Soporte 24/7', desc: 'Según SLA y criticidad', iconName: 'Headphones' },
      { title: 'Entrega ágil', desc: 'Ciclos cortos y medibles', iconName: 'Zap' },
      { title: 'Seguridad', desc: 'Buenas prácticas y hardening', iconName: 'ShieldCheck' },
    ],
  };

  return {
    data: mockData,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'mock-database',
    },
    message: 'Highlights retrieved successfully',
  };
};
