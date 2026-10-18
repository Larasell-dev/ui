import type { ReactNode } from 'react';
import { useTableContext } from './table-context.ts';
import { rowGrid } from './table-row.tsx';

type TableHeaderProps = {
  /** One `<Table.Column>` per column. */
  children?: ReactNode;
};

export function TableHeader({ children }: TableHeaderProps) {
  useTableContext('Header');

  return (
    // The hidden overflow reserves the same scrollbar gutter as the body, so
    // the header columns line up with the cells below.
    <thead
      role="rowgroup"
      className="border-border block shrink-0 [scrollbar-gutter:stable] overflow-y-hidden border-b bg-mauve-50 dark:bg-mauve-950"
    >
      <tr role="row" className={rowGrid}>
        {children}
      </tr>
    </thead>
  );
}
