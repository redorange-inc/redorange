'use server';

export type ServiceId = 'ti-solutions' | 'equipment-marketing' | 'telecom-services';

// Identificador de tema de color - se mapea a las variables CSS del global.css
export type ColorTheme = 'tech' | 'infra' | 'digital';

export type ServiceDeliverable = {
  title: string;
  content: string;
};

export type ServiceSlide = {
  id: ServiceId;
  title: string;
  subtitle: string;
  badge: string;
  bullets: string[];
  href: string;
  cta: string;
  image: string;
  deliverables: ServiceDeliverable[];
  colorTheme: ColorTheme;
  url: string;
};

const services: ServiceSlide[] = [
  {
    id: 'ti-solutions',
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
    href: '/tech',
    cta: 'Ir al servicio',
    image: '/img/tech.png',
    deliverables: [
      { title: 'Diagnóstico y levantamiento', content: 'Requerimientos, alcance, arquitectura, riesgos y plan de trabajo con entregables.' },
      { title: 'Desarrollo e implementación', content: 'Construcción, despliegue, pruebas, hardening, backups y monitoreo base.' },
      { title: 'Soporte y mejora continua', content: 'Mesa de ayuda, correctivos, preventivos, documentación y capacitación según SLA.' },
    ],
    colorTheme: 'tech',
    url: '/services/ti-solutions',
  },
  {
    id: 'equipment-marketing',
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
    href: '/infra',
    cta: 'Ver soluciones',
    image: '/img/infra.png',
    deliverables: [
      { title: 'Selección y cotización', content: 'Propuesta técnica, compatibilidad, alternativas y cotización según requerimiento y presupuesto.' },
      { title: 'Provisión e instalación', content: 'Suministro, instalación, configuración, pruebas, etiquetado y documentación técnica.' },
      { title: 'Postventa y mantenimiento', content: 'Garantías, mantenimiento preventivo/correctivo, reposiciones y soporte postventa.' },
    ],
    colorTheme: 'infra',
    url: '/services/equipment-marketing',
  },
  {
    id: 'telecom-services',
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
    href: '/digital',
    cta: 'Conocer más',
    image: '/img/digital.png',
    deliverables: [
      { title: 'Provisión y activación', content: 'Alta del servicio, configuración, seguridad base y validación de funcionamiento.' },
      { title: 'Canales y plataformas', content: 'Dominios, hosting, correo corporativo, intranet/extranet y presencia digital.' },
      { title: 'Operación y energía', content: 'Mantenimiento, monitoreo, soporte continuo y soluciones energéticas/medición.' },
    ],
    colorTheme: 'digital',
    url: '/services/telecom-services-energy',
  },
];

export const fn_get_services = async (): Promise<ServiceSlide[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return services;
};

export const fn_get_service_by_id = async (id: ServiceId): Promise<ServiceSlide | null> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return services.find((s) => s.id === id) ?? null;
};

export type AboutFeatureKey = 'ti' | 'equipos' | 'telecom';

export type AboutFeatureItem = {
  iconKey:
    | 'clipboardCheck'
    | 'code2'
    | 'workflow'
    | 'database'
    | 'wrench'
    | 'headphones'
    | 'trendingUp'
    | 'graduationCap'
    | 'hardDrive'
    | 'boxes'
    | 'router'
    | 'fileText'
    | 'network'
    | 'shield'
    | 'globe'
    | 'mail'
    | 'megaphone'
    | 'solarPanel';
  text: string;
};

export type AboutFeature = {
  key: AboutFeatureKey;
  title: string;
  description: string;
  colorTheme: ColorTheme;
  iconKey: 'code2' | 'boxes' | 'globe';
  items: AboutFeatureItem[];
};

export type AboutFooterBadge = {
  iconKey: 'target' | 'shield' | 'rocket';
  label: string;
  colorTheme: ColorTheme | 'primary'; // primary para colores base
};

export type AboutFooterCard = {
  iconKey: 'messageSquareText' | 'badgeCheck' | 'timer' | 'clipboardCheck' | 'refreshCw' | 'zap';
  title: string;
  description: string;
  colorTheme: ColorTheme | 'primary' | 'secondary' | 'accent';
};

export type AboutContent = {
  badgeLabel: string;
  brandTitle: string;
  intro: string;
  features: AboutFeature[];
  footer: {
    title: string;
    subtitle: string;
    badges: AboutFooterBadge[];
    cards: AboutFooterCard[];
  };
};

const about: AboutContent = {
  badgeLabel: 'Nosotros',
  brandTitle: 'REDORANGE E.I.R.L.',
  intro:
    'Organizamos nuestras capacidades en tres líneas claras para evitar cruces de alcance: TI (desarrollo y operación), Equipos (provisión y postventa) y Telecom/Digital/Energía (conectividad, servicios digitales y energía).',
  features: [
    {
      key: 'ti',
      iconKey: 'code2',
      title: 'Tecnología y Soluciones Informáticas (TI)',
      description: 'Consultoría, desarrollo y operación de software/sistemas, con soporte y mejora continua para asegurar continuidad operativa.',
      colorTheme: 'tech',
      items: [
        { iconKey: 'clipboardCheck', text: 'Consultoría y asesoría en informática y cómputo' },
        { iconKey: 'code2', text: 'Desarrollo de software, sistemas y aplicaciones' },
        { iconKey: 'workflow', text: 'Programación y construcción de sistemas informáticos' },
        { iconKey: 'database', text: 'Gestión de redes, bases de datos e ingeniería de procesos' },
        { iconKey: 'wrench', text: 'Administración y mantenimiento de sistemas, servidores y aplicaciones' },
        { iconKey: 'headphones', text: 'Mesa de ayuda, soporte técnico y documentación de procesos' },
        { iconKey: 'trendingUp', text: 'Mejora y estandarización de procesos' },
        { iconKey: 'graduationCap', text: 'Capacitación en herramientas informáticas' },
      ],
    },
    {
      key: 'equipos',
      iconKey: 'boxes',
      title: 'Comercialización, Importación y Servicios Técnicos de Equipos',
      description: 'Provisión de tecnología con enfoque en compatibilidad, instalación, mantenimiento y postventa: desde cotización hasta puesta en marcha.',
      colorTheme: 'infra',
      items: [
        { iconKey: 'hardDrive', text: 'Importación y exportación de equipos tecnológicos' },
        { iconKey: 'boxes', text: 'Distribución y comercialización de equipos, suministros y periféricos' },
        { iconKey: 'router', text: 'Equipos de telecomunicaciones y robótica' },
        { iconKey: 'fileText', text: 'Cotización y venta de equipos tecnológicos' },
        { iconKey: 'wrench', text: 'Reparación, mantenimiento e instalación de equipos' },
        { iconKey: 'network', text: 'Instalación de redes integrales y puesta en marcha' },
      ],
    },
    {
      key: 'telecom',
      iconKey: 'globe',
      title: 'Telecomunicaciones, Servicios Digitales y Energía Tecnológica',
      description: 'Conectividad, servicios digitales y soluciones energéticas: operación segura, disponibilidad y soporte continuo para empresas.',
      colorTheme: 'digital',
      items: [
        { iconKey: 'network', text: 'Servicios de telecomunicaciones e internet (incluye línea dedicada)' },
        { iconKey: 'shield', text: 'Hosting, cloud, storage y servidores de seguridad' },
        { iconKey: 'globe', text: 'Registro de dominios y alojamiento de páginas web' },
        { iconKey: 'mail', text: 'Correo corporativo, intranet y extranet' },
        { iconKey: 'megaphone', text: 'Publicidad digital, diseño gráfico, animación y producción' },
        { iconKey: 'solarPanel', text: 'Paneles solares, medición y servicios eléctricos asociados' },
      ],
    },
  ],
  footer: {
    title: 'Una forma de trabajo clara y medible',
    subtitle: 'Alineamos alcance, ejecución y soporte con comunicación constante. Así aseguramos trazabilidad, calidad de entregables y continuidad operativa.',
    badges: [
      { iconKey: 'target', label: 'Alcance definido', colorTheme: 'tech' },
      { iconKey: 'shield', label: 'Operación segura', colorTheme: 'infra' },
      { iconKey: 'rocket', label: 'Listo para escalar', colorTheme: 'digital' },
    ],
    cards: [
      {
        iconKey: 'messageSquareText',
        title: 'Comunicación y trazabilidad',
        description: 'Levantamiento, acuerdos, cambios y estado del trabajo documentados para control total.',
        colorTheme: 'primary',
      },
      {
        iconKey: 'badgeCheck',
        title: 'Calidad en entregables',
        description: 'Criterios definidos, validación por hitos y mejora continua por iteraciones.',
        colorTheme: 'accent',
      },
      {
        iconKey: 'timer',
        title: 'Continuidad operativa',
        description: 'Soporte, mantenimiento y evolución para sostener la operación y reducir riesgos.',
        colorTheme: 'secondary',
      },
      {
        iconKey: 'clipboardCheck',
        title: 'Plan y responsables',
        description: 'Cronograma, responsables y criterios de aceptación por entrega para evitar ambigüedades.',
        colorTheme: 'tech',
      },
      {
        iconKey: 'refreshCw',
        title: 'Soporte por SLA',
        description: 'Atención por niveles, correctivos y preventivos con seguimiento y reportes.',
        colorTheme: 'infra',
      },
      {
        iconKey: 'zap',
        title: 'Optimización continua',
        description: 'Estandarización, automatización y mejoras para rendimiento y escalabilidad.',
        colorTheme: 'digital',
      },
    ],
  },
};

export const fn_get_about = async (): Promise<AboutContent> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return about;
};

export type ContactLineKey = 'ti' | 'equipos' | 'telecom';

export type ContactBullet = {
  iconKey: 'checkCircle2';
  text: string;
};

export type ContactLine = {
  key: ContactLineKey;
  number: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  emailBodyLine: string;
  colorTheme: ColorTheme;
  iconKey: 'cpu' | 'boxes' | 'globe';
  bullets: ContactBullet[];
  subjectPlaceholder: string;
};

export type ContactMeta = {
  whatsappNumber: string;
  salesEmail: string;
  chips: Array<{ iconKey: 'clock' | 'mapPin' | 'mail'; text: string }>;
};

export type ContactContent = {
  header: {
    badgeText: string;
    title: string;
    subtitle: string;
  };
  meta: ContactMeta;
  lines: ContactLine[];
};

const contact: ContactContent = {
  header: {
    badgeText: 'Contacto',
    title: 'Contacto y cotizaciones',
    subtitle: 'Elige una línea y envíanos tu requerimiento. Te responderemos con una propuesta de alcance y opciones de servicio.',
  },
  meta: {
    whatsappNumber: '+51999999999',
    salesEmail: 'ventas@redorange.net.pe',
    chips: [
      { iconKey: 'clock', text: 'Respuesta rápida' },
      { iconKey: 'mapPin', text: 'Cobertura por proyecto' },
      { iconKey: 'mail', text: 'Correo corporativo' },
    ],
  },
  lines: [
    {
      key: 'ti',
      number: '01',
      tabLabel: 'TI',
      title: 'Tecnología y Soluciones Informáticas (TI)',
      subtitle: 'Consultoría, desarrollo de software y sistemas, soporte y continuidad operativa.',
      emailBodyLine: 'Línea: Tecnología y Soluciones Informáticas (TI)',
      colorTheme: 'tech',
      iconKey: 'cpu',
      bullets: [
        { iconKey: 'checkCircle2', text: 'Consultoría y asesoría en informática y cómputo' },
        { iconKey: 'checkCircle2', text: 'Desarrollo de software, sistemas y aplicaciones' },
        { iconKey: 'checkCircle2', text: 'Programación y construcción de sistemas informáticos' },
        { iconKey: 'checkCircle2', text: 'Operación: servidores, sistemas, redes y bases de datos' },
      ],
      subjectPlaceholder: 'Ej. sistema a medida / soporte TI / servidores',
    },
    {
      key: 'equipos',
      number: '02',
      tabLabel: 'Equipos',
      title: 'Comercialización, Importación y Servicios Técnicos de Equipos',
      subtitle: 'Provisión, cotización, instalación, mantenimiento y postventa de equipos y redes.',
      emailBodyLine: 'Línea: Comercialización, Importación y Servicios Técnicos de Equipos',
      colorTheme: 'infra',
      iconKey: 'boxes',
      bullets: [
        { iconKey: 'checkCircle2', text: 'Importación y exportación de equipos tecnológicos' },
        { iconKey: 'checkCircle2', text: 'Distribución y comercialización de equipos y suministros' },
        { iconKey: 'checkCircle2', text: 'Cotización y venta de equipos tecnológicos' },
        { iconKey: 'checkCircle2', text: 'Instalación, mantenimiento y redes integrales' },
      ],
      subjectPlaceholder: 'Ej. cotización de equipos / instalación / mantenimiento',
    },
    {
      key: 'telecom',
      number: '03',
      tabLabel: 'Telecom, Digital y Energía',
      title: 'Telecomunicaciones, Servicios Digitales y Energía Tecnológica',
      subtitle: 'Conectividad, cloud/hosting, servicios digitales y soluciones energéticas.',
      emailBodyLine: 'Línea: Telecomunicaciones, Servicios Digitales y Energía Tecnológica',
      colorTheme: 'digital',
      iconKey: 'globe',
      bullets: [
        { iconKey: 'checkCircle2', text: 'Telecomunicaciones e internet (incluye línea dedicada)' },
        { iconKey: 'checkCircle2', text: 'Hosting, cloud, storage y servidores de seguridad' },
        { iconKey: 'checkCircle2', text: 'Dominios, hosting web, correo corporativo, intranet y extranet' },
        { iconKey: 'checkCircle2', text: 'Paneles solares, medición y servicios eléctricos asociados' },
      ],
      subjectPlaceholder: 'Ej. internet dedicado / hosting / paneles solares',
    },
  ],
};

export const fn_get_contact = async (): Promise<ContactContent> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return contact;
};

export const fn_get_contact_line = async (key: ContactLineKey): Promise<ContactLine | null> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return contact.lines.find((l) => l.key === key) ?? null;
};
