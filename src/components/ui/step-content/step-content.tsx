import { FC, ReactNode } from 'react';

type StepContentProps = {
  className?: string;
  currentStep: number;
  step: number;
  children: ReactNode;
};

export const StepContent: FC<StepContentProps> = (props) => {
  const { className, currentStep, step, children } = props;

  if (currentStep !== step) {
    return null;
  }

  return <div className={className}>{children}</div>;
};
