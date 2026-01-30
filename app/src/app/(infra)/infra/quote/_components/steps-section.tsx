'use client';

import type { QuoteStep } from './types';

interface StepsSectionProps {
  steps: QuoteStep[];
}

export const StepsSection = ({ steps }: StepsSectionProps) => {
  return (
    <section data-anim="fade-up">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground">¿Cómo funciona?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Proceso simple y rápido</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={index} className="relative text-center">
            {index < steps.length - 1 && <div className="hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-infra/20" />}

            <div className="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-infra text-white font-bold text-lg">{step.number}</div>

            <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
