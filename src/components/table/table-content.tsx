import type { ReactNode } from 'react';
import { cn } from 'cn';
import { useTableContext } from './table-context.ts';

type TableContentProps = {
  /** `<Table.Header>` and `<Table.Body>`. */
  children?: ReactNode;
};

/** The `<table>` itself. The pagination goes next to it, not inside it. */
export function TableContent({ children }: TableContentProps) {
  const { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy } =
    useTableContext('Content');

  return (
    <table
      role="table"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'relative flex min-h-0 flex-1 flex-col',
        // The body's scroll mask would clip an outline drawn on the body
        // itself, so its focus ring is drawn here, around the body, with
        // the same look as the focus-ring utility.
        "after:pointer-events-none after:absolute after:content-[''] after:[position-anchor:var(--table-body-anchor)]",
        'after:top-[anchor(top)] after:right-[anchor(right)] after:bottom-[anchor(bottom)] after:left-[anchor(left)]',
        'has-[>tbody:focus-visible]:after:focus-ring',
      )}
    >
      {children}
    </table>
  );
}
