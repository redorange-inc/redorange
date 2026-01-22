import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MessageCircle, Clock, MapPin, Cpu, Boxes, Globe } from 'lucide-react';

export const Footer: FC = () => {
  const whatsappNumber = '+51987370699';
  const waDigits = whatsappNumber.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${waDigits}`;

  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/img/logo.webp" alt="Red Orange" width={40} height={40} className="rounded-md" />
              <div className="leading-none">
                <p className="font-heading text-sm font-extrabold">Red Orange</p>
                <p className="text-xs text-muted-foreground">E.I.R.L.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Soluciones integrales en <span className="text-tech">TI</span>, <span className="text-infra">equipos</span> y <span className="text-digital">telecom/digital/energía</span> para empresas e
              instituciones.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-foreground/70" />
                Atención por proyecto
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-foreground/70" />
                Lun - Sab
              </span>
            </div>

            <p className="text-xs text-muted-foreground">RUC: 20611656891</p>
          </div>

          <div className="space-y-3">
            <p className="font-heading text-sm font-bold">Navegación</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="text-muted-foreground hover:text-foreground" href="/#home">
                Inicio
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/#services">
                Líneas
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/#about">
                Sobre nosotros
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/#contact">
                Contactarnos
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-heading text-sm font-bold">Líneas</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="text-muted-foreground hover:text-foreground" href="/tech">
                <span className="inline-flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-tech" />
                  Tecnología y Soluciones Informáticas (TI)
                </span>
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/#services">
                <span className="inline-flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-infra" />
                  Comercialización e Importación de Equipos
                </span>
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/#services">
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4 text-digital" />
                  Telecomunicaciones, Servicios Digitales y Energía
                </span>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-heading text-sm font-bold">Contacto</p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="mailto: informes@redorange.net.pe" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 text-foreground/70" />
                informes@redorange.net.pe
              </a>

              <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <MessageCircle className="h-4 w-4 text-foreground/70" />
                WhatsApp {whatsappNumber}
              </a>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-foreground/70" />
                {whatsappNumber}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Red Orange E.I.R.L. Todos los derechos reservados.</p>
          <p>redorange.net.pe</p>
        </div>
      </div>
    </footer>
  );
};
