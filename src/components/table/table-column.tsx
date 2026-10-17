import { useLayoutEffect, type ReactNode } from 'react';
import { useTableContext } from './table-context.ts';

type TableColumnProps = {
  children?: ReactNode;
};

export function TableColumn({ children }: TableColumnProps) {
  // Each column counts itself, so columns inside fragments or components
  // still size the grid.
  const { registerColumn } = useTableContext('Column');
  useLayoutEffect(registerColumn, [registerColumn]);

  return (
    <th
      role="columnheader"
      scope="col"
      className="type-label-sm truncate px-4 py-2.5 text-left text-mauve-600 dark:text-mauve-400"
    >
      {children}
    </th>
  );
}
