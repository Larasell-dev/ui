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
    // Pads its end by the body's scrollbar width, so the header columns line
    // up with the cells below.
    <thead
      role="rowgroup"
      className="border-border block shrink-0 border-b bg-mauve-50 pe-(--table-scrollbar) dark:bg-mauve-950"
    >
      <tr role="row" className={rowGrid}>
        {children}
      </tr>
    </thead>
  );
}
