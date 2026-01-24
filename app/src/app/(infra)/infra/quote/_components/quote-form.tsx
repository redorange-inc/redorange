'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductCategory, PurchaseType } from './types';

interface QuoteFormProps {
  categories: ProductCategory[];
  purchaseTypes: PurchaseType[];
}

export const QuoteForm = ({ categories, purchaseTypes }: QuoteFormProps) => {
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

  return (
    <Card className="border-infra/20 bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Send className="h-5 w-5 text-infra" />
          Formulario de Cotización
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre completo<span className="text-infra ml-0.5">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                required
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border-infra/20 focus:border-infra focus:ring-infra/20"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico<span className="text-infra ml-0.5">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu-correo@empresa.com"
                required
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-infra/20 focus:border-infra focus:ring-infra/20"
              />
            </div>
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
              <label htmlFor="phone" className="text-sm font-medium">
                Teléfono<span className="text-infra ml-0.5">*</span>
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+51 999 999 999"
                required
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border-infra/20 focus:border-infra focus:ring-infra/20"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Categoría de producto<span className="text-infra ml-0.5">*</span>
              </label>
              <Select value={formData.category || ''} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="border-infra/20 focus:border-infra focus:ring-infra/20">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Tipo de compra<span className="text-infra ml-0.5">*</span>
              </label>
              <Select value={formData.purchaseType || ''} onValueChange={(value) => handleInputChange('purchaseType', value)}>
                <SelectTrigger className="border-infra/20 focus:border-infra focus:ring-infra/20">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-medium">
              Descripción del requerimiento<span className="text-infra ml-0.5">*</span>
            </label>
            <Textarea
              id="description"
              placeholder="Detalla los equipos que necesitas: modelos, especificaciones técnicas, cantidades, plazos de entrega..."
              required
              rows={4}
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="border-infra/20 focus:border-infra focus:ring-infra/20 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="file" className="text-sm font-medium">
              Adjuntar lista de requerimientos (opcional)
            </label>
            <Input id="file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="border-infra/20 file:bg-infra/10 file:text-infra file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:text-sm" />
            <p className="text-xs text-muted-foreground">PDF, Word o Excel (máx. 5MB)</p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-infra hover:bg-infra-accent text-white font-heading">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Solicitar Cotización
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center pt-2">Te contactaremos en menos de 24 horas hábiles con una cotización detallada.</p>
        </form>
      </CardContent>
    </Card>
  );
};
