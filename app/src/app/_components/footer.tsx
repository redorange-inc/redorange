import type { FC } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export const Footer: FC = () => {
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

            <p className="text-sm text-muted-foreground">Soluciones integrales en IT, servicios digitales e infraestructura tecnológica para empresas e instituciones.</p>

            <p className="text-xs text-muted-foreground">RUC: 20611656891</p>
          </div>

          <div className="space-y-3">
            <p className="font-heading text-sm font-bold">Navegación</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="text-muted-foreground hover:text-foreground" href="/#home">
                Inicio
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/#services">
                Lineas
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/#about">
                Sobre Nosotros
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/#contact">
                Contactarnos
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-heading text-sm font-bold">Lineas</p>
            <div className="flex flex-col gap-2 text-sm">
              <a className="text-muted-foreground hover:text-foreground" href="https://tech.redorange.net.pe" target="_blank" rel="noreferrer">
                IT & Technology
              </a>
              <a className="text-muted-foreground hover:text-foreground" href="https://digital.redorange.net.pe" target="_blank" rel="noreferrer">
                Digital & Web
              </a>
              <a className="text-muted-foreground hover:text-foreground" href="https://infra.redorange.net.pe" target="_blank" rel="noreferrer">
                Infra & Telecom
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-heading text-sm font-bold">Contacto</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Correo: ventas@redorange.net.pe</p>
              <p>Teléfono: Agregar número</p>
              <p>Horario: Lun - Sab</p>
            </div>

            <p className="text-xs text-muted-foreground">Si necesitas, conectamos formularios a correo, CRM o WhatsApp Business.</p>
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
