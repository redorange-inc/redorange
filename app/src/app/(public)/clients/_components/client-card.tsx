'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from './icon';
import { CLIENT_TYPE_LABELS, SERVICE_TYPE_CSS, SERVICE_TYPE_LABELS, ui } from './constants';
import type { Client } from '@/actions/fn-clients';

interface ClientCardProps {
  client: Client;
  variant?: 'default' | 'featured';
}

const typeIcons: Record<string, string> = {
  gobierno_regional: 'landmark',
  municipalidad: 'building-2',
  entidad_publica: 'building',
  empresa_privada: 'briefcase',
  persona_juridica: 'scale',
};

export const ClientCard = ({ client, variant = 'default' }: ClientCardProps) => {
  const isFeatured = variant === 'featured';

  return (
    <Card className={`${isFeatured ? 'rounded-3xl' : 'rounded-2xl'} ${ui.glassCard} ${ui.hoverLift} group overflow-hidden`}>
      <CardContent className={isFeatured ? 'p-6' : 'p-4'}>
        <div className={`flex items-start gap-${isFeatured ? '4' : '3'} mb-${isFeatured ? '4' : '3'}`}>
          <div
            className={`relative ${isFeatured ? 'w-16 h-16' : 'w-12 h-12'} rounded-${isFeatured ? '2xl' : 'xl'} bg-background/80 flex items-center justify-center overflow-hidden border border-border/50 group-hover:scale-105 transition-transform`}
          >
            {client.logo ? (
              <Image src={client.logo} alt={client.name} width={isFeatured ? 48 : 36} height={isFeatured ? 48 : 36} className="object-contain" />
            ) : (
              <Icon name={typeIcons[client.type] || 'building'} size={isFeatured ? 'lg' : 'md'} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${isFeatured ? 'font-semibold' : 'text-sm font-semibold'} text-foreground truncate`}>{client.name}</h3>
            <p className="text-[10px] text-muted-foreground">{CLIENT_TYPE_LABELS[client.type]}</p>
            {client.year && <p className="text-[10px] text-muted-foreground/70">Desde {client.year}</p>}
          </div>
        </div>

        <p className={`${isFeatured ? 'text-sm' : 'text-xs'} text-muted-foreground mb-${isFeatured ? '4' : '3'} line-clamp-2`}>{client.description}</p>

        <div className="flex flex-wrap gap-1">
          {client.services.map((service) => (
            <Badge key={service} className={`rounded-full ${isFeatured ? 'text-[10px]' : 'text-[9px] px-2 py-0.5'} ${SERVICE_TYPE_CSS[service]}`}>
              {SERVICE_TYPE_LABELS[service]}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
