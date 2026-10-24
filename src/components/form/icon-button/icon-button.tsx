import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { buttonColors } from '../button/button.tsx';

const iconButtonVariants = cva(
  [
    'box-border inline-flex shrink-0 cursor-pointer items-center justify-center text-base select-none',
    'focus-visible:focus-ring',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      // Always square. As tall as Button in the same size, but set here on its own so either can change.
      size: {
        md: 'size-10.5',
        sm: 'size-9',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type IconButtonProps = Omit<
  ComponentProps<typeof BaseButton>,
  'className' | 'style' | 'children' | 'aria-label'
> &
  VariantProps<typeof iconButtonVariants> &
  VariantProps<typeof buttonColors> & {
    /** The icon to show, usually an `Icon` with a Remix icon from `@larasell-dev/ui/icons`. */
    children: ReactNode;
    /** Names the button, which shows no text of its own. */
    'aria-label': string;
    DANGEROUS_className?: string;
    DANGEROUS_style?: CSSProperties;
  };

/** A square button that shows only an icon, named by its aria-label. */
export function IconButton({
  variant,
  size,
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: IconButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cn(
        buttonColors({ variant }),
        iconButtonVariants({ size }),
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    />
  );
}
