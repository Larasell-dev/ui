import type { ReactNode } from 'react';
import { useTableContext } from './table-context.ts';

type TableBodyProps = {
  children?: ReactNode;
};

/** The only scrolling part of the table. */
export function TableBody({ children }: TableBodyProps) {
  useTableContext('Body');

  return (
    <tbody
      role="rowgroup"
      className="scroll-mask-y-from-90% block min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto outline-none [anchor-name:var(--table-body-anchor)]"
    >
      {children}
    </tbody>
  );
}
