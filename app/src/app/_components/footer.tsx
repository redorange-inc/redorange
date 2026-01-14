import type { FC } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export const Footer: FC = () => {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/*  footer top */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {/*  logo from public/img/logo.webp */}
            <img src="/img/logo.webp" alt="Red Orange" className="h-9 w-9 rounded-md" />
            <div className="leading-none">
              <p className="font-heading text-sm font-extrabold">Red Orange</p>
              <p className="text-xs text-muted-foreground">E.I.R.L.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href="/#it-technology">
              TI y Software
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/#digital-web">
              Web y Digital
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/#infra-telecom">
              Infra y Telecom
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/#contact">
              Contacto
            </Link>
          </div>
        </div>

        <Separator className="my-6" />

        {/*  footer bottom */}
        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Red Orange E.I.R.L. Todos los derechos reservados.</p>
          <p>Soluciones para sector público y privado (SIGA, SIAF, SEACE).</p>
        </div>
      </div>
    </footer>
  );
};
