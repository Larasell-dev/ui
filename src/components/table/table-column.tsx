import type { ReactNode } from 'react';

type TableColumnProps = {
  children?: ReactNode;
};

export function TableColumn({ children }: TableColumnProps) {
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
