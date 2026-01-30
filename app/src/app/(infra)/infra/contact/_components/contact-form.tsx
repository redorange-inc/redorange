'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from './icon';
import { ui } from './constants';
import type { FormField, ServiceOption, ContactInfo } from './types';

interface ContactFormProps {
  formFields: FormField[];
  services: ServiceOption[];
  contactInfo: ContactInfo;
}

export const ContactForm = ({ formFields, services, contactInfo }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setFormData({});
  };

  const handleOpenMailClient = () => {
    const subject = encodeURIComponent('Consulta desde web - Infra');
    const body = encodeURIComponent(`Nombre: ${formData.name || ''}\nEmpresa: ${formData.company || ''}\nServicio: ${formData.service || ''}\n\nMensaje:\n${formData.message || ''}`);
    window.open(`mailto:${contactInfo.email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Card className={`rounded-3xl ${ui.glassCard}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <Icon name="send" size="md" className="text-infra" />
          Envíanos un Mensaje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {formFields.slice(0, 2).map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive ml-0.5">*</span>}
                </label>
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="bg-background/60"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="company" className="text-sm font-medium">
                Empresa / Entidad
              </label>
              <Input
                id="company"
                type="text"
                placeholder="Nombre de tu organización"
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="bg-background/60"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="service" className="text-sm font-medium">
                Servicio de interés
                <span className="text-destructive ml-0.5">*</span>
              </label>
              <Select value={formData.service || ''} onValueChange={(value) => handleInputChange('service', value)}>
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-sm font-medium">
              Mensaje
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <Textarea
              id="message"
              placeholder="Describe los equipos que necesitas, cantidades, especificaciones técnicas y cualquier detalle relevante..."
              required
              rows={4}
              value={formData.message || ''}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="bg-background/60 resize-none"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-infra-muted hover:bg-infra-accent text-white font-heading group">
              {isSubmitting ? (
                <span className="animate-pulse">Enviando...</span>
              ) : (
                <>
                  Enviar mensaje
                  <Icon name="arrow-right" size="sm" className="ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleOpenMailClient} className="flex-1 font-heading group">
              Abrir en cliente de correo
              <Icon name="send" size="sm" className="ml-2" />
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center pt-2">Al enviar este formulario, aceptas que nos comuniquemos contigo respecto a tu solicitud.</p>
        </form>
      </CardContent>
    </Card>
  );
};
