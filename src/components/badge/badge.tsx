import { cva } from 'class-variance-authority';
import { cn } from 'cn';
import type { CSSProperties, ReactNode } from 'react';

/** The colours a Badge comes in. */
export type BadgeVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

const badgeVariants = cva(
  'type-label-sm inline-flex w-fit items-center px-2 py-0.5 whitespace-nowrap ring-1 ring-inset',
  {
    variants: {
      variant: {
        neutral: 'bg-base-muted text-base-secondary ring-base-subtle',
        info: 'bg-intent-info-subtle text-intent-info ring-intent-info-subtle',
        success:
          'bg-intent-positive-subtle text-intent-positive ring-intent-positive-subtle',
        warning:
          'bg-intent-warning-subtle text-intent-warning ring-intent-warning-subtle',
        danger:
          'bg-intent-negative-subtle text-intent-negative ring-intent-negative-subtle',
      } satisfies Record<BadgeVariant, string>,
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

type BadgeProps = {
  /**
   * The badge's text, e.g. a status. It carries the meaning: the colour
   * only repeats it, so the text must make sense on its own.
   */
  children: ReactNode;
  /** The colour, by what the text means. Defaults to `neutral`. */
  variant?: BadgeVariant;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * A short label, e.g. the status of an order in a `<Table.Cell>`. It is
 * plain text to assistive tech: not focusable, and not a live region.
 */
export function Badge({
  children,
  variant,
  DANGEROUS_className,
  DANGEROUS_style,
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), DANGEROUS_className)}
      style={DANGEROUS_style}
    >
      {children}
    </span>
  );
}
