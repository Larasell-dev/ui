import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { Ref } from 'react';

type ButtonLinkParameters = {
  /** The element to render, usually a link. Without one, renders nothing. */
  render: useRender.RenderProp | undefined;
  ref: Ref<HTMLElement> | undefined;
  disabled: boolean;
  /** Keeps a disabled link in the tab order, e.g. while it loads. */
  focusableWhenDisabled?: boolean;
  /** The button's own props, merged over the rendered element's. */
  props: Record<string, unknown>;
};

/**
 * Renders a button's `render` element, e.g. an `<a>` or a router link, with the
 * button's props. Unlike Base UI's Button, it adds no button role or keyboard
 * handling, so a link stays a link. Returns `null` without `render`.
 */
export function useButtonLink({
  render,
  ref,
  disabled,
  focusableWhenDisabled = false,
  props,
}: ButtonLinkParameters) {
  return useRender({
    enabled: render !== undefined,
    render,
    ref,
    state: { disabled },
    props: mergeProps<'a'>(
      props,
      disabled
        ? {
            'aria-disabled': true,
            ...(!focusableWhenDisabled && { tabIndex: -1 }),
            // Capture runs before any click handler, including the rendered
            // link's own, e.g. a router link's, so none of them navigates.
            onClickCapture: (event) => {
              event.preventDefault();
              event.stopPropagation();
            },
          }
        : undefined,
    ),
  });
}
