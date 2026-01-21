'use server';

import type { ApiResponse, TechStackResponse } from '@/app/(tech)/tech/projects/_components/types';

export const getTechStack = async (): Promise<ApiResponse<TechStackResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: TechStackResponse = {
    items: [
      {
        name: 'Next.js',
        category: 'frontend',
        description: 'Framework React para aplicaciones web con SSR y SSG',
        iconName: 'Globe',
      },
      {
        name: 'React',
        category: 'frontend',
        description: 'Biblioteca para interfaces de usuario reactivas',
        iconName: 'Code2',
      },
      {
        name: 'Go',
        category: 'backend',
        description: 'Lenguaje para microservicios de alto rendimiento',
        iconName: 'Zap',
      },
      {
        name: 'Gorilla Mux',
        category: 'backend',
        description: 'Router HTTP para APIs REST en Go',
        iconName: 'Workflow',
      },
      {
        name: 'Fiber',
        category: 'backend',
        description: 'Framework web inspirado en Express para Go',
        iconName: 'Rocket',
      },
      {
        name: 'Kratos',
        category: 'backend',
        description: 'Framework de microservicios en Go',
        iconName: 'Layers',
      },
      {
        name: 'PostgreSQL',
        category: 'database',
        description: 'Base de datos relacional robusta y escalable',
        iconName: 'Database',
      },
      {
        name: 'Docker',
        category: 'devops',
        description: 'Contenedorización de aplicaciones',
        iconName: 'Container',
      },
      {
        name: 'MinIO',
        category: 'tools',
        description: 'Almacenamiento de objetos compatible con S3',
        iconName: 'HardDrive',
      },
      {
        name: 'Keycloak',
        category: 'tools',
        description: 'Gestión de identidades y accesos',
        iconName: 'Key',
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
