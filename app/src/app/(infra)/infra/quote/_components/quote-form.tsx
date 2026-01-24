'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';

import type { ProductCategory, PurchaseType } from './types';

interface QuoteFormProps {
  categories: ProductCategory[];
  purchaseTypes: PurchaseType[];
}

type QuoteFormValues = {
  name: string;
  email: string;
  company?: string;
  phone: string;
  category: string;
  purchaseType: string;
  description: string;
  file?: FileList;
};

const cardFxGlow =
  'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 ' +
  'backdrop-blur-md shadow-sm transition-all duration-300 ' +
  'hover:-translate-y-0.5 hover:shadow-md ' +
  'after:pointer-events-none after:absolute after:-bottom-24 after:-right-24 ' +
  'after:h-72 after:w-72 after:rounded-full ' +
  'after:bg-linear-to-br after:from-infra/25 after:via-infra-muted/15 after:to-transparent ' +
  'after:blur-3xl after:opacity-60 after:transition-opacity after:duration-300 ' +
  'group-hover:after:opacity-80';

export const QuoteForm = ({ categories, purchaseTypes }: QuoteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuoteFormValues>({
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      category: '',
      purchaseType: '',
      description: '',
      file: undefined,
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    // eslint-disable-next-line no-console
    console.log(values);
    form.reset();
  };

  return (
    <Card className={cardFxGlow}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Send className="h-5 w-5 text-infra" />
          Formulario de Cotización
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Ingresa tu nombre completo.' }}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium">
                      Nombre completo<span className="ml-0.5 text-infra">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tu nombre" className="border-infra/20 focus:border-infra focus:ring-infra/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Ingresa tu correo.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Correo inválido.',
                  },
                }}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium">
                      Correo electrónico<span className="ml-0.5 text-infra">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="tu-correo@empresa.com" className="border-infra/20 focus:border-infra focus:ring-infra/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium">Empresa / Entidad</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre de tu organización" className="border-infra/20 focus:border-infra focus:ring-infra/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                rules={{ required: 'Ingresa tu teléfono.' }}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium">
                      Teléfono<span className="ml-0.5 text-infra">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="+51 999 999 999" className="border-infra/20 focus:border-infra focus:ring-infra/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                rules={{ required: 'Selecciona una categoría.' }}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium">
                      Categoría de producto<span className="ml-0.5 text-infra">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-infra/20 focus:border-infra focus:ring-infra/20">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseType"
                rules={{ required: 'Selecciona un tipo de compra.' }}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium">
                      Tipo de compra<span className="ml-0.5 text-infra">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-infra/20 focus:border-infra focus:ring-infra/20">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {purchaseTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              rules={{ required: 'Describe tu requerimiento.' }}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium">
                    Descripción del requerimiento<span className="ml-0.5 text-infra">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Detalla los equipos que necesitas: modelos, especificaciones técnicas, cantidades, plazos de entrega..."
                      className="resize-none border-infra/20 focus:border-infra focus:ring-infra/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium">Adjuntar lista de requerimientos (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      className="border-infra/20 file:mr-3 file:rounded file:border-0 file:bg-infra/10 file:px-3 file:py-1 file:text-sm file:text-infra"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">PDF, Word o Excel (máx. 5MB)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full bg-infra-accent font-heading text-white hover:bg-infra-muted">
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

            <p className="pt-2 text-center text-xs text-muted-foreground">Te contactaremos en menos de 24 horas hábiles con una cotización detallada.</p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
