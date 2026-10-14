import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from 'cn';

export const buttonVariants = cva(
  [
    'inline-flex w-fit cursor-pointer items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap no-underline select-none',
    'focus-visible:focus-ring',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-mauve-950 text-mauve-50 hover:bg-mauve-800 active:bg-mauve-900',
          'dark:bg-mauve-100 dark:text-mauve-950 dark:hover:bg-white',
        ],
        secondary: [
          'border border-mauve-200 bg-white text-mauve-950 hover:bg-mauve-100',
          'dark:border-mauve-700 dark:bg-mauve-900 dark:text-mauve-100 dark:hover:bg-mauve-800',
        ],
        tertiary: [
          'border border-transparent bg-transparent px-5 py-2.5 text-mauve-950 no-underline hover:bg-mauve-100 hover:no-underline focus-visible:no-underline',
          'dark:text-mauve-100 dark:hover:bg-mauve-800',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className'> &
  VariantProps<typeof buttonVariants> & {
    DANGEROUS_className?: string;
  };

export function Button({
  variant,
  DANGEROUS_className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cn(buttonVariants({ variant }), DANGEROUS_className)}
    />
  );
}
