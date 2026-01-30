'use server';

import type { ApiResponse, ProjectsResponse } from '@/app/(tech)/tech/projects/_components/types';

export const getProjects = async (): Promise<ApiResponse<ProjectsResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: ProjectsResponse = {
    items: [
      {
        id: 'minio-aistor',
        name: 'MinIO Aistor',
        description: 'Servidor de almacenamiento de objetos compatible con S3 para gestión centralizada de archivos institucionales.',
        category: 'Infraestructura',
        status: 'completed',
        technologies: ['MinIO', 'Docker', 'Go', 'S3 API'],
        iconName: 'HardDrive',
        features: [
          'Almacenamiento de objetos escalable',
          'API compatible con Amazon S3',
          'Alta disponibilidad y redundancia',
          'Control de acceso granular',
          'Versionado de archivos',
        ],
      },
      {
        id: 'sso-keycloak',
        name: 'SSO con Keycloak',
        description: 'Sistema de autenticación centralizada y gestión de identidades para todas las aplicaciones institucionales.',
        category: 'Seguridad',
        status: 'completed',
        technologies: ['Keycloak', 'OAuth 2.0', 'OIDC', 'LDAP'],
        iconName: 'Key',
        features: [
          'Single Sign-On unificado',
          'Autenticación multifactor',
          'Federación de identidades',
          'Gestión de roles y permisos',
          'Integración con directorio activo',
        ],
      },
      {
        id: 'file-server',
        name: 'Servidor de Archivos',
        description: 'Sistema de gestión documental con control de versiones, permisos y auditoría de accesos.',
        category: 'Documentación',
        status: 'completed',
        technologies: ['Next.js', 'PostgreSQL', 'MinIO', 'Go'],
        iconName: 'Server',
        features: [
          'Gestión de documentos centralizada',
          'Control de versiones automático',
          'Permisos por usuario y grupo',
          'Búsqueda avanzada de contenido',
          'Auditoría completa de accesos',
        ],
      },
      {
        id: 'internal-apps',
        name: 'Aplicaciones Internas',
        description: 'Suite de aplicaciones web para automatización de procesos administrativos y operativos.',
        category: 'Desarrollo',
        status: 'in-progress',
        technologies: ['Next.js', 'React', 'Go', 'PostgreSQL'],
        iconName: 'CodeXml',
        features: [
          'Gestión de trámites digitales',
          'Flujos de trabajo automatizados',
          'Reportes y dashboards',
          'Integración con sistemas existentes',
          'Notificaciones en tiempo real',
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
