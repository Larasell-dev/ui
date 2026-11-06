import { Field } from '@base-ui/react/field';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from 'cn';

export type Required = boolean | undefined | null | 'optional';

type LabelProps = Omit<
  ComponentProps<typeof Field.Label>,
  'className' | 'style'
> & {
  required?: Required;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

export function Label({
  children,
  required,
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: LabelProps) {
  return (
    <Field.Label
      {...props}
      className={cn(
        'type-label-md text-base-primary select-none',
        'data-disabled:opacity-50',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      {children}
      {required === true && <RequiredMark />}
      {required === 'optional' && <OptionalMark />}
    </Field.Label>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden className="text-intent-negative ml-0.5 select-none">
      *
    </span>
  );
}

function OptionalMark() {
  return (
    <span className="type-caption-lg text-base-tertiary ml-1 select-none">
      (Optional)
    </span>
  );
}
