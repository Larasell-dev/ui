import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { buttonColors, type ButtonSize } from '../button/button.tsx';
import { useButtonGroup } from '../button-group/button-group-context.ts';
import { ButtonGroupItem } from '../button-group/button-group-item.tsx';

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
      } satisfies Record<ButtonSize, string>,
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
  Pick<VariantProps<typeof buttonColors>, 'variant'> & {
    /** The icon to show, usually an `Icon` with a Remix icon from `@larasell-dev/ui/icons`. */
    children: ReactNode;
    /** Names the button, which shows no text of its own. */
    'aria-label': string;
    size?: ButtonSize;
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
  const group = useButtonGroup('IconButton', size);
  const disabled = Boolean(props.disabled || group.disabled);

  return (
    <ButtonGroupItem
      grouped={group.grouped}
      focusable={!disabled}
      disabled={disabled}
    >
      <BaseButton
        {...props}
        disabled={disabled}
        className={cn(
          buttonColors({ variant, grouped: group.grouped }),
          iconButtonVariants({ size: group.size }),
          DANGEROUS_className,
        )}
        style={DANGEROUS_style}
      />
    </ButtonGroupItem>
  );
}
