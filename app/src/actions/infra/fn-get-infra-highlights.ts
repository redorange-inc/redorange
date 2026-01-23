'use server';

import type { ApiResponse, HighlightsData } from '@/app/(infra)/infra/_components/types';

export const getInfraHighlights = async (): Promise<ApiResponse<HighlightsData>> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const data: HighlightsData = {
    items: [
      { text: 'Importación directa', iconName: 'globe' },
      { text: 'Garantía extendida', iconName: 'shield' },
      { text: 'Soporte técnico', iconName: 'headphones' },
      { text: 'Instalación profesional', iconName: 'wrench' },
      { text: 'Envío nacional', iconName: 'truck' },
    ],
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
