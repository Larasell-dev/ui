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
 * (or a max height) to make the body scroll under a sticky header.
 */
export function TableRoot({
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  DANGEROUS_className,
  DANGEROUS_style,
}: TableRootProps) {
  const [columnCount, setColumnCount] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  // Unique per table so the body's focus ring anchors to its own body.
  const bodyAnchor = `--table-body-${useId().replace(/[^\w-]/g, '')}`;
  const context = useMemo(
    () => ({
      registerColumn: () => {
        setColumnCount((count) => count + 1);
        return () => setColumnCount((count) => count - 1);
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
          'flex h-full max-h-full min-h-0 w-full flex-col border border-mauve-200 bg-white dark:border-mauve-700 dark:bg-mauve-900',
          DANGEROUS_className,
        )}
        style={{
          '--table-columns': Math.max(columnCount, 1),
          '--table-body-anchor': bodyAnchor,
          ...DANGEROUS_style,
        }}
      >
        {children}
      </div>
    </TableContext>
  );
}
