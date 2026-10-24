import { useRender } from '@base-ui/react/use-render';
import { withoutStyling } from '../../utils/without-styling.ts';
import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from 'cn';

type DataListItemProps = {
  /** A `<DataList.Title>` followed by `<DataList.Field>`s. */
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * Renders the item as another element. Its `className` and `style` are
   * ignored. For an item that links somewhere, use `<DataList.Link>` in its
   * title instead.
   */
  render?: useRender.RenderProp;
};

export function DataListItem({ children, onClick, render }: DataListItemProps) {
  return useRender({
    render: withoutStyling(render),
    defaultTagName: 'li',
    props: {
      onClick,
      children,
      className: cn(
        // `relative` lets a <DataList.Link> stretch over the whole item.
        'border-border relative flex flex-col gap-2 border-b px-6 py-3 last:border-b-0 hover:bg-mauve-50',
        'has-[a:focus-visible]:outline-primary-500 has-[a:focus-visible]:bg-mauve-50 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2',
        'dark:hover:bg-mauve-800/50 dark:has-[a:focus-visible]:bg-mauve-800/50',
        onClick && 'cursor-pointer',
      ),
    },
  });
}
