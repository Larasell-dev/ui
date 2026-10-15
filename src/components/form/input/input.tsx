import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from 'cn';

type InputProps = Omit<
  ComponentProps<typeof BaseInput>,
  'className' | 'style'
> & {
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

export function Input({
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: InputProps) {
  return (
    <BaseInput
      {...props}
      className={cn(
        'type-input-md w-full border border-mauve-200 bg-white px-3.5 py-2.5 text-mauve-950',
        'placeholder:text-mauve-400 placeholder:select-none',
        'focus:focus-ring',
        'data-invalid:border-red-500 data-invalid:[--focus-ring-color:var(--color-red-500)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-mauve-700 dark:bg-mauve-900 dark:text-mauve-100 dark:placeholder:text-mauve-500 dark:placeholder:select-none dark:data-invalid:border-red-500',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    />
  );
}
