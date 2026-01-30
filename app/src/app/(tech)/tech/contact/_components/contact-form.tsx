'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from './icon';
import { ui } from './constants';
import type { ServiceOption, ContactInfo } from './types';

interface ContactFormProps {
  services: ServiceOption[];
  info: ContactInfo;
}

export const ContactForm = ({ services, info }: ContactFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const waDigits = info.whatsapp.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${waDigits}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      if (successRef.current) {
        animate(successRef.current, { scale: [0.8, 1], opacity: [0, 1], duration: 600, easing: 'easeOutBack' });
      }
    }, 1500);
  };

  const generateMailto = () => {
    const form = formRef.current;
    if (!form) return `mailto:${info.email}`;

    const formData = new FormData(form);
    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const company = (formData.get('company') as string) || '';
    const message = (formData.get('message') as string) || '';
    const service = services.find((s) => s.value === selectedService)?.label || '';

    const subject = encodeURIComponent(`Consulta TI - ${service || 'General'}`);
    const body = encodeURIComponent(
      `Hola Red Orange,\n\n` +
        `Nombre: ${name}\n` +
        `Correo: ${email}\n` +
        `Empresa: ${company || 'No especificada'}\n` +
        `Servicio de interés: ${service || 'No especificado'}\n\n` +
        `Mensaje:\n${message}\n\n` +
        `Gracias.`,
    );

    return `mailto:${info.email}?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    const fields = formRef.current?.querySelectorAll('[data-field]');
    if (!fields) return;

    fields.forEach((field, idx) => {
      const el = field as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';

      animate(el, { opacity: [0, 1], translateY: [10, 0], duration: 500, easing: 'easeOutCubic', delay: 200 + idx * 80 });
    });
  }, []);

  if (isSubmitted) {
    return (
      <Card className={`rounded-3xl ${ui.glassCard}`}>
        <CardContent className="p-8">
          <div ref={successRef} className="text-center py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-tech/20 flex items-center justify-center mb-4">
              <Icon name="circle-check" size="xl" className="text-tech" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">¡Mensaje Recibido!</h3>
            <p className="text-sm text-muted-foreground mb-6">Gracias por contactarnos. Nuestro equipo revisará tu solicitud y te responderá a la brevedad.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => setIsSubmitted(false)} className="font-heading">
                Enviar otro mensaje
              </Button>
              <Button asChild className="font-heading bg-tech-muted hover:bg-tech-accent text-white">
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  Contactar por WhatsApp
                  <Image src="/icons/whatsapp-icon.svg" alt="WhatsApp" width={16} height={16} className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`rounded-3xl ${ui.glassCard}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <Icon name="send" size="md" className="text-tech" />
          Envíanos un Mensaje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2" data-field>
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nombre completo <span className="text-destructive">*</span>
              </label>
              <Input id="name" name="name" placeholder="Tu nombre" required className="bg-background/60" />
            </div>
            <div className="space-y-2" data-field>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electrónico <span className="text-destructive">*</span>
              </label>
              <Input id="email" name="email" type="email" placeholder="tu-correo@empresa.com" required className="bg-background/60" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2" data-field>
              <label htmlFor="company" className="text-sm font-medium text-foreground">
                Empresa / Entidad
              </label>
              <Input id="company" name="company" placeholder="Nombre de tu organización" className="bg-background/60" />
            </div>
            <div className="space-y-2" data-field>
              <label htmlFor="service" className="text-sm font-medium text-foreground">
                Servicio de interés <span className="text-destructive">*</span>
              </label>
              <Select value={selectedService} onValueChange={setSelectedService} required>
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{service.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedService && (
            <div className="rounded-xl bg-tech/10 border border-tech/20 p-3 text-sm" data-field>
              <div className="flex items-center gap-2 text-tech font-medium">
                <Icon name="circle-check" size="sm" />
                {services.find((s) => s.value === selectedService)?.label}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{services.find((s) => s.value === selectedService)?.description}</p>
            </div>
          )}

          <div className="space-y-2" data-field>
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Mensaje <span className="text-destructive">*</span>
            </label>
            <Textarea id="message" name="message" placeholder="Describe tu proyecto, necesidades, plazos estimados y cualquier detalle relevante..." rows={5} required className="bg-background/60 resize-none" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2" data-field>
            <Button type="submit" disabled={isSubmitting} className="font-heading bg-tech-muted hover:bg-tech-accent text-white group flex-1">
              {isSubmitting ? (
                <span className="animate-pulse">Enviando...</span>
              ) : (
                <>
                  Enviar mensaje
                  <Icon name="arrow-right" size="sm" className="ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <Button type="button" variant="outline" className="font-heading group flex-1" asChild>
              {/* eslint-disable-next-line react-hooks/refs */}
              <a href={generateMailto()}>
                Abrir en cliente de correo
                <Icon name="send" size="sm" className="ml-2" />
              </a>
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center pt-2">Al enviar este formulario, aceptas que nos comuniquemos contigo respecto a tu solicitud.</p>
        </form>
      </CardContent>
    </Card>
  );
};
