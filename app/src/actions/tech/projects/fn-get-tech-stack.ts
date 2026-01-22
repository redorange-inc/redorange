'use server';

import type { ApiResponse, TechStackResponse } from '@/app/(tech)/tech/projects/_components/types';

export const getTechStack = async (): Promise<ApiResponse<TechStackResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: TechStackResponse = {
    items: [
      { name: 'Next.js', category: 'frontend', description: 'Framework React para aplicaciones web con SSR y SSG', iconName: 'nextjs' },
      { name: 'React', category: 'frontend', description: 'Biblioteca para interfaces de usuario reactivas', iconName: 'react' },
      { name: 'TypeScript', category: 'frontend', description: 'JavaScript con tipado estático para mayor robustez', iconName: 'typescript' },
      { name: 'JavaScript', category: 'frontend', description: 'Lenguaje dinámico para interactividad web', iconName: 'js' },
      { name: 'Go', category: 'backend', description: 'Lenguaje para microservicios de alto rendimiento', iconName: 'go' },
      { name: 'Gorilla Mux', category: 'backend', description: 'Router HTTP para APIs REST en Go', iconName: 'golang' },
      { name: 'Fiber', category: 'backend', description: 'Framework web inspirado en Express para Go', iconName: 'golang' },
      { name: 'Node.js', category: 'backend', description: 'Runtime de JavaScript para backend escalable', iconName: 'nodejs' },
      { name: 'Python', category: 'backend', description: 'Lenguaje versátil para scripts y APIs', iconName: 'python' },
      { name: 'Java', category: 'backend', description: 'Plataforma empresarial robusta y madura', iconName: 'java' },
      { name: 'PostgreSQL', category: 'database', description: 'Base de datos relacional robusta y escalable', iconName: 'postgresql' },
      { name: 'MySQL', category: 'database', description: 'Sistema de gestión de bases de datos relacional', iconName: 'mysql' },
      { name: 'MongoDB', category: 'database', description: 'Base de datos NoSQL orientada a documentos', iconName: 'mongodb' },
      { name: 'Redis', category: 'database', description: 'Almacén de datos en memoria para caché', iconName: 'redis' },
      { name: 'Docker', category: 'devops', description: 'Contenedorización de aplicaciones', iconName: 'docker' },
      { name: 'Kubernetes', category: 'devops', description: 'Orquestación de contenedores a escala', iconName: 'kubernetes' },
      { name: 'Prometheus', category: 'devops', description: 'Monitoreo y alertas de sistemas', iconName: 'prometheus' },
      { name: 'Grafana', category: 'devops', description: 'Visualización de métricas y dashboards', iconName: 'grafana' },
      { name: 'Keycloak', category: 'tools', description: 'Gestión de identidades y accesos', iconName: 'keycloak' },
      { name: 'GitHub', category: 'tools', description: 'Control de versiones y colaboración', iconName: 'github' },
    ],
  };

  return {
    data: mockData,
    meta: { timestamp: new Date().toISOString(), source: 'mock-database' },
  };
};
