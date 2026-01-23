'use server';

import type { ApiResponse, HighlightsData } from '@/app/(infra)/infra/_components/types';

export const getInfraHighlights = async (): Promise<ApiResponse<HighlightsData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: HighlightsData = {
    items: [
      { text: 'Importación directa de fábrica', iconName: 'globe' },
      { text: 'Garantía extendida en equipos', iconName: 'shield' },
      { text: 'Soporte técnico especializado', iconName: 'headphones' },
      { text: 'Instalación profesional', iconName: 'wrench' },
      { text: 'Entrega a nivel nacional', iconName: 'truck' },
    ],
  };

  return {
    data: mockData,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
