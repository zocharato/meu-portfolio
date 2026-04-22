'use client';

import * as React from 'react';
import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
};

const StepperContext = createContext<StepperContextValue | undefined>(undefined);

function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) {
    throw new Error('useStepper must be used inside Stepper');
  }
  return ctx;
}

export function Stepper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeStep, setActiveStep] = React.useState(1);

  return (
    <StepperContext.Provider value={{ activeStep, setActiveStep }}>
      <div className="w-full">{children}</div>
    </StepperContext.Provider>
  );
}

export function StepperNav({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mb-10 flex justify-center gap-10">{children}</div>;
}

export function StepperItem({
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function StepperTrigger({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  const { activeStep, setActiveStep } = useStepper();
  const isActive = activeStep === step;

  return (
    <button
      onClick={() => setActiveStep(step)}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-2',
        isActive ? 'scale-110' : ''
      )}
      type="button"
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border transition-all',
          isActive
            ? 'border-white bg-white text-black'
            : 'border-white/20 bg-transparent text-white'
        )}
      >
        {step}
      </div>

      <span className={isActive ? 'text-white' : 'text-white/70'}>{children}</span>
    </button>
  );
}

export function StepperContent({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  const { activeStep } = useStepper();

  if (activeStep !== step) return null;

  return <div className="mt-6">{children}</div>;
}