import { Button as BaseButton } from '@base-ui/react/button';
import type { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { useMemo, type ComponentProps, type CSSProperties } from 'react';
import { cn } from 'cn';
import { Spinner } from '../../spinner/spinner.tsx';
import { match } from '../../../utils/match.ts';
import { useButtonGroup } from '../button-group/button-group-context.ts';
import { ButtonGroupItem } from '../button-group/button-group-item.tsx';
import { useButtonLink } from './use-button-link.ts';

/**
 * The colors of each button variant, shared by Button and IconButton. Only colors live
 * here: each button sets its own size and spacing. Secondary and tertiary buttons that
 * open a menu or another popup keep their hover color while it is open. Solid buttons
 * in a ButtonGroup draw a divider on their leading edge, as their neighbour's border
 * matches their background.
 */
export const buttonColors = cva('', {
  variants: {
    variant: {
      primary: [
        'border-action-neutral-primary-default bg-action-neutral-primary-default text-action-neutral-on-color not-data-disabled:hover:border-action-neutral-primary-hover not-data-disabled:hover:bg-action-neutral-primary-hover not-data-disabled:active:border-action-neutral-primary-pressed not-data-disabled:active:bg-action-neutral-primary-pressed border',
      ],
      secondary: [
        'border-base-subtle bg-action-neutral-secondary-default text-base-primary not-data-disabled:hover:bg-action-neutral-secondary-hover data-popup-open:bg-action-neutral-secondary-hover border',
      ],
      tertiary: [
        // A translucent layer, so it shows on whatever the button sits on, a selected row included.
        'not-data-disabled:hover:bg-action-neutral-ghost-hover data-popup-open:bg-action-neutral-ghost-hover text-base-primary border border-transparent bg-transparent no-underline not-data-disabled:hover:no-underline focus-visible:no-underline',
      ],
      destructive: [
        // A red or brand ring would blend into the red fill.
        'focus-ring-neutral',
        'border-action-negative-primary-default bg-action-negative-primary-default text-base-on-color not-data-disabled:hover:border-action-negative-primary-hover not-data-disabled:hover:bg-action-negative-primary-hover not-data-disabled:active:border-action-negative-primary-pressed not-data-disabled:active:bg-action-negative-primary-pressed border',
      ],
    },
    grouped: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      grouped: true,
      class: '[button~&]:border-l-action-neutral-primary-divider',
    },
    {
      variant: 'destructive',
      grouped: true,
      class: '[button~&]:border-l-action-negative-primary-divider',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    grouped: false,
  },
});

/** The sizes of Button, IconButton and ButtonGroup. */
export type ButtonSize = 'md' | 'sm';

const buttonVariants = cva(
  [
    'type-label-md relative box-border inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap no-underline select-none',
    'focus-visible:focus-ring',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      // As tall as IconButton in the same size, but set here on its own so either can change.
      size: {
        md: 'h-10.5 px-5',
        sm: 'h-9 px-4',
      } satisfies Record<ButtonSize, string>,
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    defaultVariants: {
      size: 'md',
      fullWidth: false,
    },
  },
);

type LoadingProps =
  | { loading?: false; disabled?: boolean }
  | { loading: true; disabled?: never };

type ButtonProps = Omit<
  ComponentProps<typeof BaseButton>,
  | 'className'
  | 'style'
  | 'disabled'
  | 'focusableWhenDisabled'
  | 'nativeButton'
  | 'render'
> &
  VariantProps<typeof buttonVariants> &
  Pick<VariantProps<typeof buttonColors>, 'variant'> &
  LoadingProps & {
    /**
     * Renders a link that looks like the button, e.g. `render={<a href="/orders" />}`
     * or a router link. It keeps its link role.
     */
    render?: useRender.RenderProp;
    DANGEROUS_className?: string;
    DANGEROUS_style?: CSSProperties;
  };

export function Button({
  variant,
  size,
  fullWidth,
  loading,
  disabled,
  DANGEROUS_className,
  DANGEROUS_style,
  children,
  render,
  ref,
  ...props
}: ButtonProps) {
  const group = useButtonGroup('Button', size);
  const content = useMemo(() => {
    if (!loading) return 'idle';
    return fullWidth ? 'inline' : 'overlay';
  }, [loading, fullWidth]);
  const className = cn(
    buttonColors({ variant, grouped: group.grouped }),
    buttonVariants({ size: group.size, fullWidth }),
    DANGEROUS_className,
  );
  const inner = match(content, {
    idle: () => children,
    overlay: () => (
      <>
        {/* Hidden visually but kept in the accessibility tree and the layout,
          so the button keeps its name and size. */}
        <span className="opacity-0">{children}</span>
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner aria-hidden />
        </span>
      </>
    ),
    inline: () => (
      <span className="relative">
        <span className="absolute top-1/2 right-full mr-2 flex -translate-y-1/2">
          <Spinner aria-hidden />
        </span>
        {children}
      </span>
    ),
  });
  const link = useButtonLink({
    render,
    ref,
    disabled: Boolean(loading || disabled || group.disabled),
    focusableWhenDisabled: loading && !group.disabled,
    props: {
      ...props,
      'aria-busy': loading || undefined,
      className,
      style: DANGEROUS_style,
      children: inner,
    },
  });

  return (
    <ButtonGroupItem
      grouped={group.grouped}
      // A loading button stays a stop, as it stays focusable.
      focusable={!disabled && !group.disabled}
      disabled={Boolean(loading || disabled || group.disabled)}
    >
      {link ?? (
        <BaseButton
          {...props}
          ref={ref}
          disabled={loading || disabled || group.disabled}
          // A disabled group takes even a loading button out of the tab order.
          focusableWhenDisabled={loading && !group.disabled}
          aria-busy={loading || undefined}
          className={className}
          style={DANGEROUS_style}
        >
          {inner}
        </BaseButton>
      )}
    </ButtonGroupItem>
  );
}
