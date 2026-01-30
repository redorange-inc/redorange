'use server';

import type { ApiResponse, ServiceCategoriesResponse } from '@/app/(tech)/tech/services/_components/types';

export const getServiceCategories = async (): Promise<ApiResponse<ServiceCategoriesResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: ServiceCategoriesResponse = {
    items: [
      {
        id: 'consultoria',
        name: 'Consultoría y Asesoría',
        description: 'Orientación estratégica en tecnología e informática para la toma de decisiones.',
        iconName: 'Lightbulb',
        services: [
          { title: 'Evaluación de infraestructura TI', description: 'Análisis del estado actual y recomendaciones de mejora' },
          { title: 'Planificación tecnológica', description: 'Roadmap de implementación y modernización' },
          { title: 'Auditoría de sistemas', description: 'Revisión de seguridad y cumplimiento normativo' },
          { title: 'Selección de tecnologías', description: 'Asesoramiento en elección de herramientas y plataformas' },
        ],
      },
      {
        id: 'desarrollo',
        name: 'Desarrollo de Software',
        description: 'Creación de sistemas, aplicaciones y soluciones a medida.',
        iconName: 'CodeXml',
        services: [
          { title: 'Aplicaciones web', description: 'Sistemas con Next.js, React y tecnologías modernas' },
          { title: 'APIs y microservicios', description: 'Backend con Go, Fiber y arquitectura hexagonal' },
          { title: 'Integraciones', description: 'Conexión entre sistemas existentes y nuevos' },
          { title: 'Automatización', description: 'Scripts y procesos automatizados' },
        ],
      },
      {
        id: 'administracion',
        name: 'Administración de Sistemas',
        description: 'Gestión y mantenimiento de infraestructura tecnológica.',
        iconName: 'Server',
        services: [
          { title: 'Servidores', description: 'Configuración, monitoreo y mantenimiento' },
          { title: 'Sistemas operativos', description: 'Instalación, actualización y hardening' },
          { title: 'Aplicaciones', description: 'Despliegue y gestión del ciclo de vida' },
          { title: 'Respaldos', description: 'Políticas de backup y recuperación' },
        ],
      },
      {
        id: 'redes',
        name: 'Gestión de Redes',
        description: 'Administración de infraestructura de red y conectividad.',
        iconName: 'Network',
        services: [
          { title: 'Diseño de redes', description: 'Arquitectura y segmentación de red' },
          { title: 'Monitoreo', description: 'Vigilancia continua del tráfico y disponibilidad' },
          { title: 'Seguridad perimetral', description: 'Firewalls, VPNs y políticas de acceso' },
          { title: 'Optimización', description: 'Mejora de rendimiento y latencia' },
        ],
      },
      {
        id: 'bases-datos',
        name: 'Bases de Datos',
        description: 'Administración y optimización de sistemas de datos.',
        iconName: 'Database',
        services: [
          { title: 'PostgreSQL', description: 'Instalación, configuración y tuning' },
          { title: 'Modelado de datos', description: 'Diseño de esquemas y relaciones' },
          { title: 'Optimización', description: 'Queries, índices y rendimiento' },
          { title: 'Migración', description: 'Traslado de datos entre sistemas' },
        ],
      },
      {
        id: 'soporte',
        name: 'Mesa de Ayuda',
        description: 'Soporte técnico y atención a usuarios.',
        iconName: 'Headphones',
        services: [
          { title: 'Soporte nivel 1', description: 'Atención inicial y resolución de incidentes básicos' },
          { title: 'Soporte nivel 2', description: 'Escalamiento y resolución técnica especializada' },
          { title: 'Gestión de tickets', description: 'Seguimiento y trazabilidad de solicitudes' },
          { title: 'Base de conocimiento', description: 'Documentación de soluciones frecuentes' },
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
