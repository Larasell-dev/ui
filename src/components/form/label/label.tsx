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
        'text-sm font-medium text-mauve-950 select-none dark:text-mauve-100',
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
    <span
      aria-hidden
      className="ml-0.5 text-red-600 select-none dark:text-red-400"
    >
      *
    </span>
  );
}

function OptionalMark() {
  return (
    <span className="ml-1 text-sm font-normal text-mauve-500 select-none dark:text-mauve-400">
      (Optional)
    </span>
  );
}
