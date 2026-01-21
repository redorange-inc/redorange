'use server';

import type { ApiResponse, AchievementResponse } from '@/app/(tech)/tech/_components/types';

export const getAchievements = async (): Promise<ApiResponse<AchievementResponse>> => {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Mock data - simula respuesta del backend
  const mockData: AchievementResponse = {
    items: [
      { title: 'Respuesta rápida', description: 'Tiempo promedio', metric: '< 45 min', iconName: 'Clock' },
      { title: 'Certificaciones', description: 'Equipo certificado', metric: '28+', iconName: 'Award' },
      { title: 'Automatización', description: 'Procesos optimizados', metric: '75%', iconName: 'Zap' },
    ],
  };

  return {
    data: mockData,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'mock-database',
    },
    message: 'Achievements retrieved successfully',
  };
};
