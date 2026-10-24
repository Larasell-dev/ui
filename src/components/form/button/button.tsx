import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { useMemo, type ComponentProps, type CSSProperties } from 'react';
import { cn } from 'cn';
import { Spinner } from '../../spinner/spinner.tsx';
import { match } from '../../../utils/match.ts';
import { buttonColors } from './button-colors.ts';

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
  VariantProps<typeof buttonColors> &
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
  const content = useMemo(() => {
    if (!loading) return 'idle';
    return fullWidth ? 'inline' : 'overlay';
  }, [loading, fullWidth]);

  return (
    <BaseButton
      {...props}
      disabled={loading || disabled}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      className={cn(
        buttonColors({ variant }),
        buttonVariants({ size, fullWidth }),
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
  );
}
