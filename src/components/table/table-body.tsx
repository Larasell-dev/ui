import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import { useScrollMaskScrollbar } from '../../utils/use-scroll-mask-scrollbar.ts';
import { useTableContext } from './table-context.ts';

type TableBodyProps = {
  children?: ReactNode;
};

/** The only scrolling part of the table. */
export function TableBody({ children }: TableBodyProps) {
  useTableContext('Body');
  const ref = useRef<HTMLTableSectionElement>(null);
  useScrollMaskScrollbar(ref);
  useTableScrollbarWidth(ref);

  return (
    <tbody
      ref={ref}
      role="rowgroup"
      className="scroll-mask-y-from-90% block min-h-0 flex-1 overflow-y-auto outline-none [anchor-name:var(--table-body-anchor)]"
    >
      {children}
    </tbody>
  );
}

/**
 * Shares the body's scrollbar width with the header as `--table-scrollbar` on
 * the `<table>`. The header pads its end by it so the columns line up. Without
 * a scrollbar it is 0 and the rows reach the table's edge.
 */
function useTableScrollbarWidth(
  ref: RefObject<HTMLTableSectionElement | null>,
) {
  useLayoutEffect(() => {
    const body = ref.current;
    const table = body?.parentElement;
    if (!body || !table) return;
    const measure = () => {
      const style = getComputedStyle(body);
      const scrollbar =
        body.offsetWidth -
        body.clientWidth -
        parseFloat(style.borderLeftWidth) -
        parseFloat(style.borderRightWidth);
      table.style.setProperty(
        '--table-scrollbar',
        `${Math.max(scrollbar, 0)}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, [ref]);
}
