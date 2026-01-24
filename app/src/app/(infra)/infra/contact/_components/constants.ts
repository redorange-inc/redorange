export const INFRA_STYLES = {
  gradient: 'bg-gradient-to-br from-infra/5 via-transparent to-transparent',
  gradientCard: 'bg-gradient-to-br from-infra/5 via-infra/3 to-transparent',

  glassCard: 'bg-card/60 backdrop-blur-md border-infra/20',

  primaryButton: 'bg-infra hover:bg-infra-accent text-white',
  outlineButton: 'border-infra/30 hover:bg-infra/10 text-foreground',

  accentText: 'text-infra',
  mutedText: 'text-muted-foreground',

  iconBg: 'bg-infra/10',
  iconColor: 'text-infra',

  badge: 'border-infra/30 bg-infra/10 text-infra',
  tag: 'bg-gradient-to-r from-infra to-infra-muted text-white',
} as const;

export const CONTACT_ICONS = {
  email: 'mail',
  phone: 'phone',
  whatsapp: 'messageCircle',
  location: 'mapPin',
  clock: 'clock',
  send: 'send',
  externalLink: 'externalLink',
} as const;
