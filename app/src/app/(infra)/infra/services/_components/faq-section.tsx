'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { ServiceFAQ } from './types';

interface FAQSectionProps {
  faqs: ServiceFAQ[];
}

export const FAQSection = ({ faqs }: FAQSectionProps) => {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">Preguntas Frecuentes</h2>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-infra/20 rounded-lg bg-card/60 backdrop-blur-md px-4"
          >
            <AccordionTrigger className="text-left font-medium hover:text-infra">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
