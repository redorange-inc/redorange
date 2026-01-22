'use server';

import type { ApiResponse, MethodologyResponse } from '@/app/(tech)/tech/method/_components/types';

export const getMethodologies = async (): Promise<ApiResponse<MethodologyResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: MethodologyResponse = {
    items: [
      {
        title: 'Scrum',
        description: 'Marco ágil para gestión de proyectos con sprints iterativos y entregas incrementales de valor.',
        iconName: 'RefreshCw',
        benefits: [
          'Entregas frecuentes cada 2-4 semanas',
          'Adaptación rápida a cambios',
          'Transparencia y comunicación constante',
          'Mejora continua del equipo',
        ],
      },
      {
        title: 'Kanban',
        description: 'Visualización del flujo de trabajo para optimizar la eficiencia y reducir cuellos de botella.',
        iconName: 'Workflow',
        benefits: [
          'Visibilidad del trabajo en progreso',
          'Límites WIP para evitar sobrecarga',
          'Flujo continuo de entregas',
          'Métricas de rendimiento claras',
        ],
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
