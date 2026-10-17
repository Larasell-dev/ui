import {
  Children,
  isValidElement,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from 'cn';
import { TableContext } from './table-context.ts';
import { TablePagination } from './table-pagination.tsx';

type TableRootProps = {
  /** Accessible name of the table. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  DANGEROUS_className?: string;
};

/**
 * Fills the height of its parent. Give the parent a height (or a max height)
 * to make the body scroll under a sticky header.
 */
export function TableRoot({
  children,
  DANGEROUS_className,
  ...props
}: TableRootProps) {
  const [columnCount, setColumnCount] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);
  // Unique per table so the body's focus ring anchors to its own body.
  const bodyAnchor = `--table-body-${useId().replace(/[^\w-]/g, '')}`;
  const context = useMemo(
    () => ({
      registerColumn: () => {
        setColumnCount((count) => count + 1);
        return () => setColumnCount((count) => count - 1);
      },
      scrollBodyToTop: () => {
        tableRef.current?.querySelector('tbody')?.scrollTo({ top: 0 });
      },
    }),
    [],
  );

  // A <nav> can't live inside a <table>, so the pagination is lifted out
  // and rendered below it.
  const content: ReactNode[] = [];
  const pagination: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === TablePagination) {
      pagination.push(child);
    } else {
      content.push(child);
    }
  });

  return (
    <TableContext value={context}>
      <div
        className={cn(
          'flex h-full max-h-full min-h-0 w-full flex-col border border-mauve-200 bg-white dark:border-mauve-700 dark:bg-mauve-900',
          DANGEROUS_className,
        )}
      >
        <table
          {...props}
          ref={tableRef}
          role="table"
          style={
            {
              '--table-columns': Math.max(columnCount, 1),
              '--table-body-anchor': bodyAnchor,
            } as CSSProperties
          }
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
          {content}
        </table>
        {pagination}
      </div>
    </TableContext>
  );
}
