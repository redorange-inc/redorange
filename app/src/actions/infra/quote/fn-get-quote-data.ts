'use server';

import type { ApiResponse, QuotePageData } from '@/app/(infra)/infra/quote/_components/types';

export const getQuoteData = async (): Promise<ApiResponse<QuotePageData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const data: QuotePageData = {
    hero: {
      badge: 'Cotización Infra',
      tag: 'Equipos y Servicios',
      title: 'Solicita tu Cotización',
      description: 'Obtén precios competitivos en equipos de cómputo, accesorios, telecomunicaciones y servicios técnicos. Respuesta en menos de 24 horas.',
    },
    categories: [
      { value: 'equipos-computo', label: 'Equipos de Cómputo', description: 'Laptops, PCs, workstations, servidores' },
      { value: 'accesorios', label: 'Accesorios y Periféricos', description: 'Monitores, teclados, mouse, webcams' },
      { value: 'suministros', label: 'Suministros Tecnológicos', description: 'Memorias, discos, cables, adaptadores' },
      { value: 'telecomunicaciones', label: 'Telecomunicaciones', description: 'Routers, switches, access points' },
      { value: 'robotica', label: 'Robótica', description: 'Kits Arduino, Raspberry Pi, sensores' },
      { value: 'redes', label: 'Instalación de Redes', description: 'Cableado estructurado, configuración' },
      { value: 'reparacion', label: 'Reparación de Equipos', description: 'Diagnóstico y servicio técnico' },
      { value: 'importacion', label: 'Importación por Pedido', description: 'Equipos específicos bajo pedido' },
    ],
    purchaseTypes: [
      { value: 'individual', label: 'Compra Individual', description: 'Uso personal o pequeñas cantidades', iconName: 'user' },
      { value: 'empresarial', label: 'Compra Empresarial', description: 'Empresas con volumen medio', iconName: 'building' },
      { value: 'volumen', label: 'Compra por Volumen', description: 'Grandes cantidades con descuento', iconName: 'boxes' },
      { value: 'licitacion', label: 'Licitación Pública', description: 'Procesos con entidades del estado', iconName: 'fileText' },
    ],
    benefits: [
      { title: 'Respuesta en 24h', description: 'Cotización detallada en un día hábil', iconName: 'clock' },
      { title: 'Precios Competitivos', description: 'Importación directa de fábrica', iconName: 'tag' },
      { title: 'Asesoría Técnica', description: 'Te ayudamos a elegir lo mejor', iconName: 'headphones' },
      { title: 'Garantía Incluida', description: 'Todos los equipos con garantía', iconName: 'shield' },
    ],
    steps: [
      { number: 1, title: 'Envía tu solicitud', description: 'Completa el formulario con tus requerimientos' },
      { number: 2, title: 'Recibe tu cotización', description: 'Te enviamos precios y disponibilidad en 24h' },
      { number: 3, title: 'Confirma tu pedido', description: 'Coordina el pago y la entrega' },
      { number: 4, title: 'Recibe tus equipos', description: 'Entrega con garantía incluida' },
    ],
    contactEmail: 'informes@redorange.net.pe',
    contactPhone: '+51 987 370 699',
    contactWhatsapp: '51987370699',
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
