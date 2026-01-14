import type { FC, ReactNode, JSX } from 'react';
import type { Metadata, Viewport } from 'next';
import { Poppins, Montserrat, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
});

//  base url principal para metadata y open graph
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim() || 'https://redorange.net.pe';

//  titulo y descripcion enfocados en una sola landing con tres lineas de servicio
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  //  single page title sin template
  title: 'Red Orange | IT, Digital & Infrastructure Solutions',
  description:
    'Red Orange E.I.R.L. brinda soluciones integrales en TI y software, servicios digitales (web/hosting/correo) e infraestructura tecnológica (hardware, telecom y conectividad). Consultoría, implementación, soporte, mantenimiento y capacitación para sector público y privado (SIGA, SIAF, SEACE).',

  //  keywords orientadas a seace y servicios tecnologicos
  keywords: [
    'Red Orange',
    'Red Orange EIRL',
    'consultoría TI',
    'desarrollo de software',
    'sistemas de información',
    'cloud',
    'servidores',
    'redes',
    'bases de datos',
    'mesa de ayuda',
    'soporte técnico',
    'mantenimiento preventivo',
    'mantenimiento correctivo',
    'SIGA',
    'SIAF',
    'SEACE',
    'desarrollo web',
    'hosting',
    'dominios',
    'correo corporativo',
    'ciberseguridad',
    'hardware',
    'telecomunicaciones',
    'internet dedicado',
    'cableado estructurado',
  ],

  //  identidad editorial
  authors: [{ name: 'Red Orange E.I.R.L.' }],
  creator: 'Red Orange E.I.R.L.',
  publisher: 'Red Orange E.I.R.L.',
  applicationName: 'Red Orange',

  //  canonical fijo para landing unica
  alternates: { canonical: '/' },

  //  indexacion para buscadores
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },

  //  open graph para compartir en redes
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: '/',
    siteName: 'Red Orange',
    title: 'Red Orange | IT, Digital & Infrastructure Solutions',
    description:
      'Soluciones integrales en TI y software, servicios digitales (web/hosting/correo) e infraestructura tecnológica (hardware, telecom y conectividad). Servicios orientados a sector público y privado (SIGA, SIAF, SEACE).',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Red Orange - IT, Digital & Infrastructure Solutions' }],
  },

  //  twitter cards
  twitter: {
    card: 'summary_large_image',
    title: 'Red Orange | IT, Digital & Infrastructure Solutions',
    description: 'TI y software, servicios digitales e infraestructura tecnológica. Consultoría, implementación, soporte, mantenimiento y capacitación (SIGA, SIAF, SEACE).',
    images: ['/og-image.png'],
  },

  //  iconos y manifest
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/img/logo.webp', sizes: '32x32', type: 'image/webp' },
    ],
    apple: [{ url: '/img/logo.webp', sizes: '180x180' }],
  },

  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,

  //  theme color para ui del navegador en light y dark
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ children }): JSX.Element => {
  return (
    <html lang="es-PE" className={`${poppins.variable} ${montserrat.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}>
        {/*  theme provider para soportar dark mode y preferencias */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
