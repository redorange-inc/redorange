'use client';

import type { QuoteStep } from './types';

interface StepsSectionProps {
  steps: QuoteStep[];
}

export const StepsSection = ({ steps }: StepsSectionProps) => {
  return (
    <section className="py-8">
      <h2 className="font-heading text-2xl font-bold text-center mb-8">¿Cómo funciona?</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={index} className="relative text-center">
            {index < steps.length - 1 && <div className="hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-infra/20" />}

            <div className="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-infra text-white font-heading font-bold text-lg">{step.number}</div>

            <h3 className="font-heading font-semibold mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
