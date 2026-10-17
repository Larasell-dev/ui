import { Children, useLayoutEffect, type ReactNode } from 'react';
import { useTableContext } from './table-context.ts';
import { rowGrid } from './table-row.tsx';

type TableHeaderProps = {
  /** One `<Table.Column>` per column. */
  children?: ReactNode;
};

export function TableHeader({ children }: TableHeaderProps) {
  const { setColumnCount } = useTableContext('Header');
  const count = Children.toArray(children).length;

  useLayoutEffect(() => {
    setColumnCount(Math.max(count, 1));
  }, [count, setColumnCount]);

  return (
    // The hidden overflow reserves the same scrollbar gutter as the body, so
    // the header columns line up with the cells below.
    <thead
      role="rowgroup"
      className="block shrink-0 [scrollbar-gutter:stable] overflow-y-hidden border-b border-mauve-200 bg-mauve-50 dark:border-mauve-700 dark:bg-mauve-950"
    >
      <tr role="row" className={rowGrid}>
        {children}
      </tr>
    </thead>
  );
}
