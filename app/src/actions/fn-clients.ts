'use server';

import { CLIENT_CATEGORY_LABELS, SERVICE_TYPE_COLORS, SERVICE_TYPE_LABELS } from '@/app/(public)/clients/_components/constants';

// -- types

export type ServiceType = 'tech' | 'infra' | 'digital';

export type ClientType = 'gobierno_regional' | 'municipalidad' | 'entidad_publica' | 'empresa_privada' | 'persona_juridica' | 'persona_natural';

export type ClientCategory = 'public_entities' | 'private_entities' | 'other_clients';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  category: ClientCategory;
  ruc?: string;
  logo?: string;
  description: string;
  services: ServiceType[];
  isPublic: boolean;
  featured?: boolean;
  testimonial?: string;
  year?: number;
}

export interface ServiceStats {
  service: ServiceType;
  label: string;
  count: number;
  color: string;
}

export interface CategoryStats {
  category: ClientCategory;
  label: string;
  count: number;
  serviceBreakdown: ServiceStats[];
}

export interface ClientStats {
  total: number;
  naturalPersonsCount: number;
  byCategory: CategoryStats[];
  byService: ServiceStats[];
}

export interface ClientsPageData {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };
  stats: ClientStats;
  featuredClients: Client[];
  publicEntities: Client[];
  privateEntities: Client[];
  otherClients: Client[];
}

// -- data

const clients: Client[] = [
  // Public Entities - Gobiernos Regionales
  {
    id: 'gore-ayacucho',
    name: 'Gobierno Regional de Ayacucho',
    type: 'gobierno_regional',
    category: 'public_entities',
    ruc: '20452080',
    logo: '/img/clients/gore-ayacucho.webp',
    description: 'Implementación de sistemas de gestión documental y modernización de infraestructura tecnológica.',
    services: ['tech', 'infra'],
    isPublic: true,
    featured: true,
    year: 2022,
  },
  // Public Entities - Municipalidades
  {
    id: 'muni-huamanga',
    name: 'Municipalidad Provincial de Huamanga',
    type: 'municipalidad',
    category: 'public_entities',
    ruc: '20145698741',
    logo: '/img/clients/muni-huamanga.webp',
    description: 'Desarrollo de plataforma de trámites en línea y sistema de atención al ciudadano.',
    services: ['tech', 'digital'],
    isPublic: true,
    featured: true,
    year: 2021,
  },
  {
    id: 'muni-san-juan-bautista',
    name: 'Municipalidad Distrital de San Juan Bautista',
    type: 'municipalidad',
    category: 'public_entities',
    ruc: '20456987123',
    logo: '/img/clients/muni-sjb.webp',
    description: 'Provisión de equipos de cómputo y configuración de red institucional.',
    services: ['infra', 'digital'],
    isPublic: true,
    year: 2023,
  },
  {
    id: 'muni-carmen-alto',
    name: 'Municipalidad Distrital de Carmen Alto',
    type: 'municipalidad',
    category: 'public_entities',
    ruc: '20456987124',
    logo: '/img/clients/muni-carmen-alto.webp',
    description: 'Implementación de sistema de gestión administrativa y soporte técnico continuo.',
    services: ['tech', 'infra'],
    isPublic: true,
    year: 2022,
  },
  {
    id: 'muni-jesus-nazareno',
    name: 'Municipalidad Distrital de Jesús Nazareno',
    type: 'municipalidad',
    category: 'public_entities',
    ruc: '20456987125',
    logo: '/img/clients/muni-jesus-nazareno.webp',
    description: 'Desarrollo de portal web institucional y sistema de trámites.',
    services: ['tech', 'digital'],
    isPublic: true,
    year: 2023,
  },
  // Public Entities - Otras Entidades Públicas
  {
    id: 'ugel-huamanga',
    name: 'UGEL Huamanga',
    type: 'entidad_publica',
    category: 'public_entities',
    ruc: '20789456123',
    logo: '/img/clients/ugel-huamanga.webp',
    description: 'Soporte técnico y mantenimiento de equipos informáticos para instituciones educativas.',
    services: ['tech', 'infra'],
    isPublic: true,
    featured: true,
    year: 2020,
  },
  {
    id: 'hospital-regional',
    name: 'Hospital Regional de Ayacucho',
    type: 'entidad_publica',
    category: 'public_entities',
    ruc: '20789456124',
    logo: '/img/clients/hospital-regional.webp',
    description: 'Implementación de infraestructura de red y sistemas de información hospitalaria.',
    services: ['tech', 'infra', 'digital'],
    isPublic: true,
    year: 2021,
  },
  // Private Entities - Empresas Privadas
  {
    id: 'coop-santa-maria',
    name: 'Cooperativa Santa María Magdalena',
    type: 'empresa_privada',
    category: 'private_entities',
    ruc: '20123456789',
    logo: '/img/clients/coop-santa-maria.webp',
    description: 'Desarrollo de sistema de gestión de socios y plataforma de servicios en línea.',
    services: ['tech'],
    isPublic: true,
    year: 2022,
  },
  {
    id: 'hotel-ayacucho',
    name: 'Hotel Ayacucho Plaza',
    type: 'empresa_privada',
    category: 'private_entities',
    ruc: '20123456790',
    logo: '/img/clients/hotel-ayacucho.webp',
    description: 'Implementación de sistema de reservas y configuración de red WiFi para huéspedes.',
    services: ['tech', 'digital'],
    isPublic: true,
    year: 2023,
  },
  // Other Clients - Personas Jurídicas
  {
    id: 'ong-desarrollo',
    name: 'ONG Desarrollo Sostenible Ayacucho',
    type: 'persona_juridica',
    category: 'other_clients',
    ruc: '20567891234',
    logo: '/img/clients/ong-desarrollo.webp',
    description: 'Provisión de equipos y capacitación en herramientas digitales.',
    services: ['infra', 'tech'],
    isPublic: true,
    year: 2022,
  },
  {
    id: 'asoc-productores',
    name: 'Asociación de Productores de Quinua',
    type: 'persona_juridica',
    category: 'other_clients',
    ruc: '20567891235',
    logo: '/img/clients/asoc-productores.webp',
    description: 'Desarrollo de plataforma web para comercialización de productos.',
    services: ['tech', 'digital'],
    isPublic: true,
    year: 2023,
  },
];

const NATURAL_PERSONS_COUNT = 45;

// -- helper functions

const getServiceStats = (clientList: Client[]): ServiceStats[] => {
  const serviceTypes: ServiceType[] = ['tech', 'infra', 'digital'];

  return serviceTypes.map((service) => ({ service, label: SERVICE_TYPE_LABELS[service], count: clientList.filter((c) => c.services.includes(service)).length, color: SERVICE_TYPE_COLORS[service] }));
};

const calculateStats = (): ClientStats => {
  const publicClients = clients.filter((c) => c.isPublic);

  const publicEntities = publicClients.filter((c) => c.category === 'public_entities');
  const privateEntities = publicClients.filter((c) => c.category === 'private_entities');
  const otherClients = publicClients.filter((c) => c.category === 'other_clients');

  const byCategory: CategoryStats[] = [
    { category: 'public_entities', label: CLIENT_CATEGORY_LABELS.public_entities, count: publicEntities.length, serviceBreakdown: getServiceStats(publicEntities) },
    { category: 'private_entities', label: CLIENT_CATEGORY_LABELS.private_entities, count: privateEntities.length, serviceBreakdown: getServiceStats(privateEntities) },
    { category: 'other_clients', label: CLIENT_CATEGORY_LABELS.other_clients, count: otherClients.length + NATURAL_PERSONS_COUNT, serviceBreakdown: getServiceStats(otherClients) },
  ];

  const byService = getServiceStats(publicClients);

  return { total: publicClients.length + NATURAL_PERSONS_COUNT, naturalPersonsCount: NATURAL_PERSONS_COUNT, byCategory, byService };
};

const filterClientsByCategory = (category: ClientCategory): Client[] => clients.filter((c) => c.isPublic && c.category === category);

export const getClientsData = async (): Promise<{ data: ClientsPageData }> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const stats = calculateStats();
  const featuredClients = clients.filter((c) => c.isPublic && c.featured);

  return {
    data: {
      hero: {
        badge: 'Clientes',
        title: 'Nuestros Clientes',
        subtitle: 'Confianza y Resultados',
        description:
          'Trabajamos con entidades públicas, gobiernos, municipalidades, empresas privadas y personas naturales, brindando soluciones tecnológicas que impulsan su crecimiento y transformación digital.',
      },
      stats,
      featuredClients,
      publicEntities: filterClientsByCategory('public_entities'),
      privateEntities: filterClientsByCategory('private_entities'),
      otherClients: filterClientsByCategory('other_clients'),
    },
  };
};

export const getClientById = async (id: string): Promise<Client | null> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return clients.find((c) => c.id === id && c.isPublic) || null;
};
