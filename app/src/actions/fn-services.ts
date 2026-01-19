// app/src/actions/fn-services.ts
'use server';

export type ServiceId = 'ti-soluciones' | 'equipos-comercializacion' | 'telecom-servicios-energia';

export type ServiceSlide = {
  id: ServiceId;
  title: string;
  subtitle: string;
  badge: string;
  bullets: string[];
  href: string;
  cta: string;
  image: string;
  deliverables: { title: string; content: string }[];
  gradient: string;
  accentColor: string;
  url: string;
};

const SERVICES_MOCK: ServiceSlide[] = [
  {
    id: 'ti-soluciones',
    title: 'Tecnología y Soluciones Informáticas (TI)',
    subtitle: 'Consultoría, desarrollo, soporte y continuidad operativa',
    badge: 'Para procesos y operación crítica',
    bullets: [
      'Consultoría y asesoría en informática y cómputo',
      'Desarrollo de software, sistemas y aplicaciones',
      'Programación y construcción de sistemas informáticos',
      'Administración y mantenimiento de sistemas, servidores y aplicaciones',
      'Gestión de redes, bases de datos, mejora de procesos y capacitación',
    ],
    href: 'https://tech.redorange.net.pe',
    cta: 'Ir al servicio',
    image: '/img/tech.png',
    deliverables: [
      { title: 'Diagnóstico y levantamiento', content: 'Requerimientos, alcance, arquitectura, riesgos y plan de trabajo con entregables.' },
      { title: 'Desarrollo e implementación', content: 'Construcción, despliegue, pruebas, hardening, backups y monitoreo base.' },
      { title: 'Soporte y mejora continua', content: 'Mesa de ayuda, correctivos, preventivos, documentación y capacitación según SLA.' },
    ],
    gradient: 'from-cyan-500/15 via-blue-500/10 to-transparent',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    url: '/services/ti-solutions',
  },
  {
    id: 'equipos-comercializacion',
    title: 'Comercialización, Importación y Servicios Técnicos de Equipos',
    subtitle: 'Equipos, periféricos, provisión, instalación, mantenimiento y postventa',
    badge: 'Para equipamiento y provisión',
    bullets: [
      'Importación y exportación de equipos tecnológicos',
      'Representación, distribución y comercialización de equipos, periféricos y suministros',
      'Comercialización de equipos de telecomunicaciones y robótica',
      'Cotización y venta de equipos tecnológicos',
      'Reparación, mantenimiento, instalación de equipos e instalación de redes integrales',
    ],
    href: 'https://infra.redorange.net.pe',
    cta: 'Ver soluciones',
    image: '/img/infra.png',
    deliverables: [
      { title: 'Selección y cotización', content: 'Propuesta técnica, compatibilidad, alternativas y cotización según requerimiento y presupuesto.' },
      { title: 'Provisión e instalación', content: 'Suministro, instalación, configuración, pruebas, etiquetado y documentación técnica.' },
      { title: 'Postventa y mantenimiento', content: 'Garantías, mantenimiento preventivo/correctivo, reposiciones y soporte postventa.' },
    ],
    gradient: 'from-rose-500/15 via-orange-500/10 to-transparent',
    accentColor: 'text-rose-600 dark:text-rose-400',
    url: '/services/equipment-marketing',
  },
  {
    id: 'telecom-servicios-energia',
    title: 'Telecomunicaciones, Servicios Digitales y Energía Tecnológica',
    subtitle: 'Internet, cloud, hosting, seguridad, canales digitales y energía',
    badge: 'Para conectividad y presencia digital',
    bullets: [
      'Servicios de telecomunicaciones e internet (incluye línea dedicada)',
      'Hosting, cloud, storage y servidores de seguridad',
      'Registro de dominios, alojamiento web, correo corporativo, intranet y extranet',
      'Publicidad en internet, diseño gráfico, animación, edición y producción digital',
      'Venta e instalación de paneles solares, equipos de medición y servicios eléctricos asociados',
    ],
    href: 'https://digital.redorange.net.pe',
    cta: 'Conocer más',
    image: '/img/digital.png',
    deliverables: [
      { title: 'Provisión y activación', content: 'Alta del servicio, configuración, seguridad base y validación de funcionamiento.' },
      { title: 'Canales y plataformas', content: 'Dominios, hosting, correo corporativo, intranet/extranet y presencia digital.' },
      { title: 'Operación y energía', content: 'Mantenimiento, monitoreo, soporte continuo y soluciones energéticas/medición.' },
    ],
    gradient: 'from-orange-500/15 via-amber-500/10 to-transparent',
    accentColor: 'text-orange-600 dark:text-orange-400',
    url: '/services/telecom-services-energy',
  },
];

export const fn_get_services = async (): Promise<ServiceSlide[]> => {
  return SERVICES_MOCK;
};
