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
        neutral:
          'bg-mauve-100 text-mauve-800 ring-mauve-200 dark:bg-mauve-800 dark:text-mauve-100 dark:ring-mauve-700',
        info: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-800',
        success:
          'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800',
        warning:
          'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-800',
        danger:
          'bg-red-50 text-red-800 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-800',
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
