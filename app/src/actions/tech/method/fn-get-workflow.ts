'use server';

import type { ApiResponse, WorkflowResponse } from '@/app/(tech)/tech/method/_components/types';

export const getWorkflow = async (): Promise<ApiResponse<WorkflowResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: WorkflowResponse = {
    items: [
      {
        step: 1,
        title: 'Análisis y Planificación',
        description: 'Levantamiento de requerimientos, definición de alcance y planificación de sprints.',
        iconName: 'Target',
      },
      {
        step: 2,
        title: 'Diseño de Arquitectura',
        description: 'Definición de la estructura del sistema siguiendo principios SOLID y patrones establecidos.',
        iconName: 'Boxes',
      },
      {
        step: 3,
        title: 'Desarrollo Iterativo',
        description: 'Implementación en sprints con revisiones de código y pruebas continuas.',
        iconName: 'CodeXml',
      },
      {
        step: 4,
        title: 'Testing y QA',
        description: 'Pruebas unitarias, de integración y validación de requerimientos.',
        iconName: 'CheckCircle',
      },
      {
        step: 5,
        title: 'Despliegue y Monitoreo',
        description: 'Entrega continua con CI/CD y monitoreo de rendimiento en producción.',
        iconName: 'Zap',
      },
      {
        step: 6,
        title: 'Retroalimentación',
        description: 'Revisión de métricas, retrospectivas y mejora continua del proceso.',
        iconName: 'RefreshCw',
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
