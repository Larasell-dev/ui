import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from 'cn';

const buttonVariants = cva(
  [
    'type-label-md inline-flex cursor-pointer items-center justify-center gap-2 px-5 py-2.5 whitespace-nowrap no-underline select-none',
    'focus-visible:focus-ring',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-mauve-950 text-mauve-50 not-data-disabled:hover:bg-mauve-800 not-data-disabled:active:bg-mauve-900',
          'dark:bg-mauve-100 dark:text-mauve-950 dark:not-data-disabled:hover:bg-white',
        ],
        secondary: [
          'border border-mauve-200 bg-white text-mauve-950 not-data-disabled:hover:bg-mauve-100',
          'dark:border-mauve-700 dark:bg-mauve-900 dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800',
        ],
        tertiary: [
          'border border-transparent bg-transparent px-5 py-2.5 text-mauve-950 no-underline not-data-disabled:hover:bg-mauve-100 not-data-disabled:hover:no-underline focus-visible:no-underline',
          'dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800',
        ],
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    defaultVariants: {
      variant: 'primary',
      fullWidth: false,
    },
  },
);

type LoadingProps =
  | { loading?: false; disabled?: boolean }
  | { loading: true; disabled?: never };

type ButtonProps = Omit<
  ComponentProps<typeof BaseButton>,
  'className' | 'style' | 'disabled' | 'focusableWhenDisabled'
> &
  VariantProps<typeof buttonVariants> &
  LoadingProps & {
    DANGEROUS_className?: string;
    DANGEROUS_style?: CSSProperties;
  };

export function Button({
  variant,
  fullWidth,
  loading,
  disabled,
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      disabled={loading || disabled}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ variant, fullWidth }),
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    />
  );
}
