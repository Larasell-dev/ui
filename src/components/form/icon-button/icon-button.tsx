import { Button as BaseButton } from '@base-ui/react/button';
import type { IconifyIcon } from '@iconify/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ComponentProps, CSSProperties } from 'react';
import { Icon } from '../../icon/icon.tsx';
import { buttonColors } from '../button/button-colors.ts';

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
    /** Remix icon to show, imported from `@larasell-dev/ui/icons`. */
    icon: IconifyIcon;
    /** Names the button, which shows no text of its own. */
    'aria-label': string;
    children?: never;
    DANGEROUS_className?: string;
    DANGEROUS_style?: CSSProperties;
  };

/** A square button that shows only an icon, named by its aria-label. */
export function IconButton({
  icon,
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
    >
      <Icon icon={icon} />
    </BaseButton>
  );
}
