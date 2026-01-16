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
    bio: 'Visionaria tecnológica con más de 10 años de experiencia liderando proyectos de transformación digital, gobierno digital y ciberseguridad. Comprometida con el desarrollo de soluciones seguras, innovadoras y centradas en el futuro digital de las organizaciones.',
    tags: ['IA', 'Ciberseguridad', 'Transformación Digital', 'Innovación', 'Estrategia'],
    stats: {
      projects: '20+',
      experience: '10 años',
    },
    image: '',
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
    bio: 'Profesional en Ingeniería de Sistemas con Doctorado en Administración y maestrías en Gestión Pública e Investigación/Docencia. Lidera la entrega end-to-end de proyectos de software, estandariza la PMO y la calidad, y asegura el cumplimiento en entornos de gobierno digital. Experto en gestión de portafolios, riesgos, presupuesto y relación con stakeholders para implementaciones previsibles y de alto impacto.',
    tags: ['PMO', 'Gobierno Digital', 'Calidad', 'Gestión de Riesgos', 'Scrum', 'PMBOK'],
    stats: {
      projects: '15+',
      experience: '10 años',
    },
    image: '',
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
    bio: 'Ingeniero de Sistemas con formación en Gerencia de Sistemas Informáticos, Redes y Telecomunicaciones, y Gestión de Proyectos TI. Especialista en diseñar y operar infraestructuras seguras y escalables para servicios críticos de gobierno digital. Lidera redes, virtualización y cloud híbrida, hardening y monitoreo, asegurando alta disponibilidad, continuidad operativa y soporte confiable a los equipos de desarrollo.',
    tags: ['Infraestructura', 'Redes', 'DevOps', 'Seguridad', 'Cloud', 'Virtualización', 'Linux'],
    stats: {
      projects: '10+',
      experience: '8+ años',
    },
    image: '',
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
    bio: 'Lic. en Administración - colegiada, con conocimientos de los principios fundamentales de la Administración, sistemas administrativos de Gestión Pública y atención al cliente. Con experiencia en liderazgo, trabajo en equipo, planeación y toma de decisiones, ha desempeñado cargos en municipalidades, el INEI y programas sociales, orientada al desarrollo humano, inclusión social y control interno en entidades del Estado.',
    tags: ['Gestión Pública', 'Liderazgo', 'Trabajo en equipo', 'Resolución de problemas', 'Responsabilidad', 'Escucha activa', 'INEI'],
    stats: {
      projects: '10+',
      experience: '3+ años',
    },
    image: '',
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
