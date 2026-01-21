'use server';

import type { ApiResponse, ContactPageData } from '@/app/(tech)/tech/contact/_components/types';

export const getContactData = async (): Promise<ApiResponse<ContactPageData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: ContactPageData = {
    hero: {
      badge: 'Contacto TI',
      title: 'Hablemos de tu Proyecto',
      subtitle: 'Tecnología y Soluciones Informáticas',
      description: 'Cuéntanos sobre tus necesidades tecnológicas. Nuestro equipo de especialistas está listo para ayudarte a encontrar la solución ideal para tu organización.',
    },
    info: {
      email: 'ti@redorange.net.pe',
      phone: '+51 999 999 999',
      whatsapp: '+51999999999',
      address: 'Lima, Perú',
      schedule: 'Lunes a Viernes: 9:00 - 18:00',
      mapUrl: 'https://maps.google.com/?q=Lima,Peru',
    },
    services: [
      { value: 'consultoria', label: 'Consultoría y Asesoría', description: 'Evaluación y planificación tecnológica' },
      { value: 'desarrollo', label: 'Desarrollo de Software', description: 'Aplicaciones web y sistemas a medida' },
      { value: 'infraestructura', label: 'Infraestructura', description: 'Servidores, redes y bases de datos' },
      { value: 'soporte', label: 'Soporte Técnico', description: 'Mesa de ayuda y mantenimiento' },
      { value: 'seguridad', label: 'Seguridad', description: 'Auditoría y hardening de sistemas' },
      { value: 'capacitacion', label: 'Capacitación', description: 'Formación en herramientas TI' },
      { value: 'otro', label: 'Otro', description: 'Especificar en el mensaje' },
    ],
    formFields: [
      { id: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre', required: true },
      { id: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu-correo@empresa.com', required: true },
      { id: 'company', label: 'Empresa / Entidad', type: 'text', placeholder: 'Nombre de tu organización', required: false },
      { id: 'service', label: 'Servicio de interés', type: 'select', placeholder: 'Selecciona un servicio', required: true },
      { id: 'message', label: 'Mensaje', type: 'textarea', placeholder: 'Describe tu proyecto, necesidades, plazos estimados y cualquier detalle relevante...', required: true },
    ],
    features: [
      { title: 'Respuesta Rápida', description: 'Respondemos en menos de 24 horas hábiles', iconName: 'Zap' },
      { title: 'Evaluación Gratuita', description: 'Análisis inicial sin compromiso', iconName: 'CheckCircle' },
      { title: 'Equipo Especializado', description: 'Profesionales certificados en TI', iconName: 'Shield' },
      { title: 'Soporte Continuo', description: 'Acompañamiento durante todo el proyecto', iconName: 'Headphones' },
    ],
  };

  return {
    data: mockData,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'static-data',
    },
  };
};
