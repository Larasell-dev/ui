import { Field } from '@base-ui/react/field';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from 'cn';

type ErrorProps = Omit<
  ComponentProps<typeof Field.Error>,
  'className' | 'style'
> & {
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

export function Error({
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: ErrorProps) {
  return (
    <Field.Error
      {...props}
      className={cn(
        'text-sm text-red-600 dark:text-red-400',
        'data-disabled:opacity-50',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    />
  );
}
