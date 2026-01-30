'use server';

export type TeamMemberSocial = {
  platform: 'github' | 'linkedin' | 'instagram' | 'facebook' | 'x';
  url: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: 'Liderazgo' | 'Tecnología' | 'Gestión Pública' | 'Diseño' | 'Desarrollo';
  bio: string;
  tags: string[];
  stats: {
    projects: string;
    experience: string;
  };
  image: string;
  socials: TeamMemberSocial[];
  iconOverride?: 'boxes' | 'rocket' | 'target' | 'award';
};

const teamMembers: TeamMember[] = [
  {
    id: 'luis-jerson-ramos',
    name: 'Luis Jerson Ramos Benito',
    role: 'CEO & Fundador',
    department: 'Liderazgo',
    bio: 'Líder tecnológico con más de 10 años de experiencia impulsando la transformación digital, el gobierno digital y la ciberseguridad. Enfocado en desarrollar soluciones organizacionales seguras e innovadoras.',
    tags: ['IA', 'Ciberseguridad', 'Transformación Digital', 'Innovación', 'Estrategia'],
    stats: {
      projects: '20+',
      experience: '10 años',
    },
    image: '/img/team/luis.webp',
    socials: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/' },
      { platform: 'github', url: 'https://github.com/' },
      { platform: 'x', url: 'https://x.com/' },
    ],
  },
  {
    id: 'nixon-fernandez',
    name: 'Nixon Omar Fernandez Carrion',
    role: 'Head of Delivery & PMO',
    department: 'Liderazgo',
    bio: 'Ingeniero de Sistemas con Doctorado en Administración y doble maestría. Experto en la gestión end-to-end de proyectos de software, estandarización de PMO y gobierno digital. Especialista en manejo de portafolios, riesgos y stakeholders para asegurar implementaciones de alto impacto.',
    tags: ['PMO', 'Gobierno Digital', 'Calidad', 'Gestión de Riesgos', 'Scrum', 'PMBOK'],
    stats: {
      projects: '15+',
      experience: '10 años',
    },
    image: '/img/team/nixon.webp',
    socials: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/' },
      { platform: 'facebook', url: 'https://facebook.com/' },
    ],
    iconOverride: 'boxes',
  },
  {
    id: 'winser-santa-cruz',
    name: 'Winser Santa Cruz Lopez',
    role: 'Jefe de Proyectos',
    department: 'Tecnología',
    bio: 'Ingeniero de Sistemas especializado en Infraestructura TI y Redes. Diseña y opera entornos seguros y escalables (Cloud Híbrida/Virtualización) para servicios críticos de gobierno digital, garantizando alta disponibilidad, hardening y continuidad operativa.',
    tags: ['Infraestructura', 'Redes', 'DevOps', 'Seguridad', 'Cloud', 'Virtualización', 'Linux'],
    stats: {
      projects: '10+',
      experience: '8+ años',
    },
    image: '/img/team/winser.webp',
    socials: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/' },
      { platform: 'github', url: 'https://github.com/' },
      { platform: 'instagram', url: 'https://instagram.com/' },
    ],
  },
  {
    id: 'wendy-chavez',
    name: 'Wendy Sofía Chávez Hidalgo',
    role: 'Licenciada en Administración',
    department: 'Gestión Pública',
    bio: 'Licenciada en Administración colegiada y egresada de Maestría en Gestión Pública. Especialista en sistemas administrativos del Estado, control interno y atención al ciudadano. Cuenta con experiencia en municipalidades, INEI y programas sociales, enfocada en el desarrollo humano y la inclusión social.',
    tags: ['Gestión Pública', 'Liderazgo', 'Trabajo en equipo', 'Resolución de problemas', 'Responsabilidad', 'Escucha activa', 'INEI', 'Maestría en Gestión Pública'],
    stats: {
      projects: '10+',
      experience: '3+ años',
    },
    image: '/img/team/wendy.webp',
    socials: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/' },
      { platform: 'facebook', url: 'https://facebook.com/' },
      { platform: 'instagram', url: 'https://instagram.com/' },
    ],
  },
];

export const fn_get_team = async (): Promise<TeamMember[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return teamMembers;
};

export const fn_get_team_member = async (id: string): Promise<TeamMember | null> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return teamMembers.find((member) => member.id === id) || null;
};
