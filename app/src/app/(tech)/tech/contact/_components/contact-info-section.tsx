'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { ui } from './constants';
import type { ContactInfo } from './types';

interface ContactInfoSectionProps {
  info: ContactInfo;
}

export const ContactInfoSection = ({ info }: ContactInfoSectionProps) => {
  const waDigits = info.whatsapp.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${waDigits}`;

  const contactItems = [
    { icon: <Mail className="h-5 w-5" />, label: 'Correo electrónico', value: info.email, href: `mailto:${info.email}` },
    { icon: <Phone className="h-5 w-5" />, label: 'Teléfono', value: info.phone, href: `tel:${info.phone.replace(/\s/g, '')}` },
    { icon: <MessageCircle className="h-5 w-5" />, label: 'WhatsApp', value: info.phone, href: whatsappHref, external: true },
    { icon: <MapPin className="h-5 w-5" />, label: 'Ubicación', value: info.address, href: info.mapUrl, external: true },
    { icon: <Clock className="h-5 w-5" />, label: 'Horario de atención', value: info.schedule, href: null },
  ];

  return (
    <section data-anim="fade-up">
      <h2 className="text-xl font-bold text-foreground mb-4">Información de Contacto</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contactItems.map((item, idx) => (
          <Card key={idx} className={`rounded-2xl ${ui.glassCard} ${item.href ? ui.hoverLift : ''} group`}>
            <CardContent className="p-4">
              {item.href ? (
                <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} className="flex items-center gap-3">
                  <div className="rounded-xl bg-tech/20 p-2.5 text-tech group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-tech transition-colors">{item.value}</div>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-tech/20 p-2.5 text-tech">{item.icon}</div>
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
