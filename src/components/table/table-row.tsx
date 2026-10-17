import { useRender } from '@base-ui/react/use-render';
import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from 'cn';

export const rowGrid =
  'grid grid-cols-[repeat(var(--table-columns),minmax(0,1fr))]';

type TableRowProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * Renders the row as another element, such as a link:
   * `render={<a href="/orders/1001" />}`. Its props are merged with the
   * row's: event handlers both run and class names are joined.
   */
  render?: useRender.RenderProp;
};

export function TableRow({ children, onClick, render }: TableRowProps) {
  const interactive = Boolean(onClick || render);

  return useRender({
    render,
    defaultTagName: 'tr',
    props: {
      role: 'row',
      onClick,
      children,
      className: cn(
        rowGrid,
        'border-b border-mauve-100 text-inherit no-underline last:border-b-0 hover:bg-mauve-50',
        'focus-visible:outline-primary-500 focus-visible:bg-mauve-50 focus-visible:outline-2 focus-visible:-outline-offset-2',
        'dark:border-mauve-800 dark:hover:bg-mauve-800/50 dark:focus-visible:bg-mauve-800/50',
        interactive && 'cursor-pointer',
      ),
    },
  });
}
