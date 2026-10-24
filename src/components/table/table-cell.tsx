import type { ReactNode } from 'react';

type TableCellProps = {
  children?: ReactNode;
};

export function TableCell({ children }: TableCellProps) {
  return (
    <td
      role="cell"
      className="type-body-md truncate px-6 py-3 text-mauve-950 dark:text-mauve-100"
    >
      {children}
    </td>
  );
}
