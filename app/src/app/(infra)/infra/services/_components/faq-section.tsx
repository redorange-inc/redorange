'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ui } from './constants';
import type { ServiceFAQ } from './types';

interface FAQSectionProps {
  faqs: ServiceFAQ[];
}

export const FAQSection = ({ faqs }: FAQSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Preguntas Frecuentes</h2>
        <p className="mt-1 text-sm text-muted-foreground">Respuestas a las dudas más comunes</p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`} className={`rounded-2xl ${ui.glassCard} px-4 border`}>
            <AccordionTrigger className="text-left font-medium hover:text-infra">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
