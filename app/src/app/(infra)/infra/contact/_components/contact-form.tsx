'use client';

import { useState } from 'react';
import { Send, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="border-infra/20 bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Send className="h-5 w-5 text-infra" />
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
                  {field.required && <span className="text-infra ml-0.5">*</span>}
                </label>
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="border-infra/20 focus:border-infra focus:ring-infra/20"
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
                className="border-infra/20 focus:border-infra focus:ring-infra/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="service" className="text-sm font-medium">
                Servicio de interés
                <span className="text-infra ml-0.5">*</span>
              </label>
              <Select value={formData.service || ''} onValueChange={(value) => handleInputChange('service', value)}>
                <SelectTrigger className="border-infra/20 focus:border-infra focus:ring-infra/20">
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
              <span className="text-infra ml-0.5">*</span>
            </label>
            <Textarea
              id="message"
              placeholder="Describe los equipos que necesitas, cantidades, especificaciones técnicas y cualquier detalle relevante..."
              required
              rows={4}
              value={formData.message || ''}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="border-infra/20 focus:border-infra focus:ring-infra/20 resize-none"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-infra-accent hover:bg-infra-muted text-white font-heading">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar mensaje
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleOpenMailClient} className="flex-1 border-infra/30 hover:bg-infra/10 font-heading">
              Abrir en cliente de correo
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">Al enviar este formulario, aceptas que nos comuniquemos contigo respecto a tu solicitud.</p>
        </form>
      </CardContent>
    </Card>
  );
};
