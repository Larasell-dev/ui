import { useRender } from '@base-ui/react/use-render';
import { withoutStyling } from '../../utils/without-styling.ts';
import type { ReactNode } from 'react';

type TableLinkProps = {
  children?: ReactNode;
  /**
   * The link element, e.g. `render={<a href="/orders/1001" />}` or a router
   * link. Defaults to an `<a>`.
   */
  render?: useRender.RenderProp;
};

/**
 * Makes the whole row a link. Put it in one cell, usually the first; its text
 * is the link's accessible name. The row stays a table row and the link is its
 * only tab stop.
 */
export function TableLink({ children, render }: TableLinkProps) {
  return useRender({
    render: withoutStyling(render),
    defaultTagName: 'a',
    props: {
      children,
      className:
        "text-inherit no-underline outline-none after:absolute after:inset-0 after:content-['']",
    },
  });
}
