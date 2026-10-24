import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { useMemo, type ComponentProps, type CSSProperties } from 'react';
import { cn } from 'cn';
import { Spinner } from '../../spinner/spinner.tsx';
import { match } from '../../../utils/match.ts';
import { useButtonGroup } from '../button-group/button-group-context.ts';
import { ButtonGroupItem } from '../button-group/button-group-item.tsx';

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
        'border border-mauve-950 bg-mauve-950 text-mauve-50 not-data-disabled:hover:border-mauve-800 not-data-disabled:hover:bg-mauve-800 not-data-disabled:active:border-mauve-900 not-data-disabled:active:bg-mauve-900',
        'dark:border-mauve-100 dark:bg-mauve-100 dark:text-mauve-950 dark:not-data-disabled:hover:border-white dark:not-data-disabled:hover:bg-white',
      ],
      secondary: [
        'border-border border bg-white text-mauve-950 not-data-disabled:hover:bg-mauve-100 data-popup-open:bg-mauve-100',
        'dark:bg-mauve-900 dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800 dark:data-popup-open:bg-mauve-800',
      ],
      tertiary: [
        'border border-transparent bg-transparent text-mauve-950 no-underline not-data-disabled:hover:bg-mauve-100 not-data-disabled:hover:no-underline focus-visible:no-underline data-popup-open:bg-mauve-100',
        'dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800 dark:data-popup-open:bg-mauve-800',
      ],
      destructive: [
        'border border-red-600 bg-red-600 text-white not-data-disabled:hover:border-red-700 not-data-disabled:hover:bg-red-700 not-data-disabled:active:border-red-800 not-data-disabled:active:bg-red-800',
        'dark:border-red-500 dark:bg-red-500 dark:not-data-disabled:hover:border-red-400 dark:not-data-disabled:hover:bg-red-400',
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
      class: '[button~&]:border-l-mauve-600 dark:[button~&]:border-l-mauve-400',
    },
    {
      variant: 'destructive',
      grouped: true,
      class: '[button~&]:border-l-red-800 dark:[button~&]:border-l-red-700',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    grouped: false,
  },
});

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
      },
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
  'className' | 'style' | 'disabled' | 'focusableWhenDisabled'
> &
  VariantProps<typeof buttonVariants> &
  Pick<VariantProps<typeof buttonColors>, 'variant'> &
  LoadingProps & {
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
  ...props
}: ButtonProps) {
  const group = useButtonGroup('Button', size);
  const content = useMemo(() => {
    if (!loading) return 'idle';
    return fullWidth ? 'inline' : 'overlay';
  }, [loading, fullWidth]);

  return (
    <ButtonGroupItem
      grouped={group.grouped}
      // A loading button stays a stop, as it stays focusable.
      focusable={!disabled && !group.disabled}
      disabled={Boolean(loading || disabled || group.disabled)}
    >
      <BaseButton
        {...props}
        disabled={loading || disabled || group.disabled}
        // A disabled group takes even a loading button out of the tab order.
        focusableWhenDisabled={loading && !group.disabled}
        aria-busy={loading || undefined}
        className={cn(
          buttonColors({ variant, grouped: group.grouped }),
          buttonVariants({ size: group.size, fullWidth }),
          DANGEROUS_className,
        )}
        style={DANGEROUS_style}
      >
        {match(content, {
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
        })}
      </BaseButton>
    </ButtonGroupItem>
  );
}
