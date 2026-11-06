import type { ReactNode } from 'react';
import { cn } from 'cn';

type GuidelineProps = {
  children: ReactNode;
};

export function Do({ children }: GuidelineProps) {
  return (
    <Guideline
      title="Do"
      borderClassName="border-intent-positive"
      titleClassName="text-intent-positive"
    >
      {children}
    </Guideline>
  );
}

export function DoNot({ children }: GuidelineProps) {
  return (
    <Guideline
      title="Don't"
      borderClassName="border-intent-negative"
      titleClassName="text-action-negative-default"
    >
      {children}
    </Guideline>
  );
}

type InternalGuidelineProps = GuidelineProps & {
  title: string;
  borderClassName: string;
  titleClassName: string;
};

function Guideline({
  title,
  borderClassName,
  titleClassName,
  children,
}: InternalGuidelineProps) {
  return (
    <div className={cn('border-t-2 pt-3', borderClassName)}>
      <p className={cn('type-label-md', titleClassName)}>{title}</p>
      <div className="type-body-md text-base-primary mt-2">{children}</div>
    </div>
  );
}
