import { useRender } from '@base-ui/react/use-render';
import { withoutStyling } from '../../utils/without-styling.ts';
import type { ReactNode } from 'react';

type DataListLinkProps = {
  children?: ReactNode;
  /**
   * The link element, e.g. `render={<a href="/orders/1001" />}` or a router
   * link. Defaults to an `<a>`.
   */
  render?: useRender.RenderProp;
};

/**
 * Makes the whole item a link. Put it in the `<DataList.Title>`; its text is
 * the link's accessible name and the link is the item's only tab stop.
 */
export function DataListLink({ children, render }: DataListLinkProps) {
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
