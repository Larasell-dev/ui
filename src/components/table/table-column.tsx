import { useLayoutEffect, type ReactNode } from 'react';
import { useTableContext } from './table-context.ts';

type TableColumnProps = {
  children?: ReactNode;
  /**
   * `action` is the column for `<Table.Actions>`. Put it last: it is only as
   * wide as the trigger, sits at the end of the row, and its label (e.g.
   * "Actions") is read by screen readers only.
   */
  type?: 'data' | 'action';
};

export function TableColumn({ children, type = 'data' }: TableColumnProps) {
  // Each column counts itself, so columns inside fragments or components
  // still size the grid.
  const { registerColumn } = useTableContext('Column');
  useLayoutEffect(() => registerColumn(type), [registerColumn, type]);

  return (
    <th
      role="columnheader"
      scope="col"
      className="type-label-sm truncate px-4 py-2.5 text-left text-mauve-600 dark:text-mauve-400"
    >
      {type === 'action' ? (
        <span className="sr-only">{children}</span>
      ) : (
        children
      )}
    </th>
  );
}
