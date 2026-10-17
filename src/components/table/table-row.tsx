import { useRender } from '@base-ui/react/use-render';
import { withoutStyling } from '../../utils/without-styling.ts';
import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from 'cn';

export const rowGrid =
  'grid grid-cols-[repeat(var(--table-columns),minmax(0,1fr))_var(--table-actions,)]';

type TableRowProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * Renders the row as another element, e.g. a router's row component. Its
   * props are merged with the row's: event handlers both run and class names
   * are joined; its `className` and `style` are ignored. For a row that links somewhere, use `<Table.Link>` in a cell
   * instead, so the row keeps its table semantics.
   */
  render?: useRender.RenderProp;
};

export function TableRow({ children, onClick, render }: TableRowProps) {
  return useRender({
    render: withoutStyling(render),
    defaultTagName: 'tr',
    props: {
      role: 'row',
      onClick,
      children,
      className: cn(
        rowGrid,
        // `relative` lets a <Table.Link> stretch over the whole row.
        'relative border-b border-mauve-100 last:border-b-0 hover:bg-mauve-50',
        'has-[a:focus-visible]:outline-primary-500 has-[a:focus-visible]:bg-mauve-50 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2',
        'dark:border-mauve-800 dark:hover:bg-mauve-800/50 dark:has-[a:focus-visible]:bg-mauve-800/50',
        onClick && 'cursor-pointer',
      ),
    },
  });
}
