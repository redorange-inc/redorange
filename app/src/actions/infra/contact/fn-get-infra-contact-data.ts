'use server';

import type { ApiResponse, ContactPageData } from '@/app/(infra)/infra/contact/_components/types';

export const getInfraContactData = async (): Promise<ApiResponse<ContactPageData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: ContactPageData = {
    hero: {
      badge: 'Contacto Infra',
      tag: 'Comercialización e Importación de Equipos',
      title: 'Cotiza tu Equipamiento',
      description: 'Cuéntanos qué equipos necesitas. Nuestro equipo comercial está listo para ofrecerte las mejores opciones de importación y servicios técnicos.',
    },
    info: {
      email: 'informes@redorange.net.pe',
      phone: '+51 987 370 699',
      whatsapp: '+51987370699',
      address: 'Lima, Perú',
      schedule: 'Lunes a Viernes: 9:00 - 18:00',
      mapUrl: 'https://maps.google.com/?q=Lima,Peru',
    },
    services: [
      { value: 'equipos-computo', label: 'Equipos de Cómputo', description: 'Laptops, PCs, workstations y servidores' },
      { value: 'accesorios', label: 'Accesorios y Periféricos', description: 'Monitores, teclados, mouse y más' },
      { value: 'telecomunicaciones', label: 'Telecomunicaciones', description: 'Routers, switches y access points' },
      { value: 'importacion', label: 'Importación por Pedido', description: 'Equipos específicos bajo pedido' },
      { value: 'reparacion', label: 'Reparación de Equipos', description: 'Servicio técnico especializado' },
      { value: 'redes', label: 'Instalación de Redes', description: 'Cableado estructurado y configuración' },
      { value: 'cotizacion-volumen', label: 'Cotización por Volumen', description: 'Compras corporativas y licitaciones' },
      { value: 'otro', label: 'Otro', description: 'Especificar en el mensaje' },
    ],
    formFields: [
      { id: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre', required: true },
      { id: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu-correo@empresa.com', required: true },
      { id: 'company', label: 'Empresa / Entidad', type: 'text', placeholder: 'Nombre de tu organización', required: false },
      { id: 'service', label: 'Servicio de interés', type: 'select', placeholder: 'Selecciona un servicio', required: true },
      { id: 'message', label: 'Mensaje', type: 'textarea', placeholder: 'Describe los equipos que necesitas, cantidades, especificaciones técnicas y cualquier detalle relevante...', required: true },
    ],
    features: [
      { title: 'Cotización Rápida', description: 'Respuesta en menos de 24 horas hábiles', iconName: 'zap' },
      { title: 'Importación Directa', description: 'Traemos equipos de fábrica a tu medida', iconName: 'globe' },
      { title: 'Garantía Incluida', description: 'Todos nuestros equipos con garantía', iconName: 'shield' },
      { title: 'Soporte Técnico', description: 'Instalación y mantenimiento post-venta', iconName: 'headphones' },
    ],
  };

  return {
    data: mockData,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
