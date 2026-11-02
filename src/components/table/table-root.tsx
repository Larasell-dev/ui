import {
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from 'cn';
import { TableContext } from './table-context.ts';

type TableRootProps = {
  /** Accessible name of the table. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** A `<Table.Content>`, optionally followed by a `<Table.Pagination>`. */
  children?: ReactNode;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * The table's frame. Fills the height of its parent: give the parent a height
 * (or a max height) to make the body scroll under a sticky header. It has no
 * outer border: it is meant for full-width layouts, where the surrounding page
 * draws the edges.
 */
export function TableRoot({
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  DANGEROUS_className,
  DANGEROUS_style,
}: TableRootProps) {
  const [columnCount, setColumnCount] = useState(0);
  const [actionsCount, setActionsCount] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  // Unique per table so the body's focus ring anchors to its own body.
  const bodyAnchor = `--table-body-${useId().replace(/[^\w-]/g, '')}`;
  const context = useMemo(
    () => ({
      registerColumn: (type: 'data' | 'action') => {
        const setCount = type === 'action' ? setActionsCount : setColumnCount;
        setCount((count) => count + 1);
        return () => setCount((count) => count - 1);
      },
      scrollBodyToTop: () => {
        frameRef.current?.querySelector('tbody')?.scrollTo({ top: 0 });
      },
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    }),
    [ariaLabel, ariaLabelledBy],
  );

  return (
    <TableContext value={context}>
      <div
        ref={frameRef}
        className={cn(
          // Isolated, so the z-index that lifts the actions above a row's link
          // stays inside the table.
          'bg-surface isolate flex h-full max-h-full min-h-0 w-full flex-col',
          DANGEROUS_className,
        )}
        style={{
          '--table-columns': Math.max(columnCount, 1),
          // Fits the actions trigger and the cell's padding.
          '--table-actions': actionsCount > 0 ? '5.25rem' : undefined,
          '--table-body-anchor': bodyAnchor,
          ...DANGEROUS_style,
        }}
      >
        {children}
      </div>
    </TableContext>
  );
}
