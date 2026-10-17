import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from 'cn';

export const rowGrid =
  'grid grid-cols-[repeat(var(--table-columns),minmax(0,1fr))]';

type TableRowProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
};

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr
      role="row"
      onClick={onClick}
      className={cn(
        rowGrid,
        'border-b border-mauve-100 last:border-b-0 hover:bg-mauve-50',
        'dark:border-mauve-800 dark:hover:bg-mauve-800/50',
        onClick && 'cursor-pointer',
      )}
    >
      {children}
    </tr>
  );
}
