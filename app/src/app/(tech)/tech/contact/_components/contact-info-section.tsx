'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from './icon';
import { ui } from './constants';
import type { ContactInfo } from './types';

interface ContactInfoSectionProps {
  info: ContactInfo;
}

interface ContactItem {
  iconName: string;
  label: string;
  value: string;
  href: string | null;
  external?: boolean;
  useWhatsappIcon?: boolean;
}

export const ContactInfoSection = ({ info }: ContactInfoSectionProps) => {
  const waDigits = info.whatsapp.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${waDigits}`;

  const contactItems: ContactItem[] = [
    { iconName: 'mail', label: 'Correo electrónico', value: info.email, href: `mailto:${info.email}` },
    { iconName: 'phone', label: 'Teléfono', value: info.phone, href: `tel:${info.phone.replace(/\s/g, '')}` },
    { iconName: 'message-circle', label: 'WhatsApp', value: info.phone, href: whatsappHref, external: true, useWhatsappIcon: true },
  ];

  return (
    <section data-anim="fade-up">
      <h2 className="text-xl font-bold text-foreground mb-4">Información de Contacto</h2>

      <div className="grid gap-3">
        {contactItems.map((item, idx) => (
          <Card key={idx} className={`rounded-2xl ${ui.glassCard} ${item.href ? ui.hoverLift : ''} group`}>
            <CardContent className="p-4">
              {item.href ? (
                <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} className="flex items-center gap-3">
                  <div className="rounded-full bg-tech/20 p-2.5 text-tech group-hover:scale-110 transition-transform">
                    {item.useWhatsappIcon ? <Image src="/icons/whatsapp-icon.svg" alt="WhatsApp" width={20} height={20} /> : <Icon name={item.iconName} size="md" />}
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-tech transition-colors">{item.value}</div>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-tech/20 p-2.5 text-tech">
                    <Icon name={item.iconName} size="md" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</div>
                    <div className="text-sm font-semibold text-foreground">{item.value}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
