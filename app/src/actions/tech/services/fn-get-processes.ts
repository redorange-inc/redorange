'use server';

import type { ApiResponse, ProcessesResponse } from '@/app/(tech)/tech/services/_components/types';

export const getProcesses = async (): Promise<ApiResponse<ProcessesResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: ProcessesResponse = {
    items: [
      {
        title: 'Mejora de Procesos',
        description: 'Análisis y optimización de flujos de trabajo institucionales.',
        iconName: 'TrendingUp',
        steps: [
          'Levantamiento del proceso actual',
          'Identificación de cuellos de botella',
          'Propuesta de mejora',
          'Implementación y seguimiento',
        ],
      },
      {
        title: 'Estandarización',
        description: 'Definición de normas y procedimientos técnicos.',
        iconName: 'Target',
        steps: [
          'Diagnóstico de estado actual',
          'Definición de estándares',
          'Documentación técnica',
          'Capacitación y adopción',
        ],
      },
      {
        title: 'Documentación',
        description: 'Creación y mantenimiento de documentación técnica.',
        iconName: 'FileText',
        steps: [
          'Inventario de sistemas',
          'Diagramas de arquitectura',
          'Manuales de usuario',
          'Guías de operación',
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
