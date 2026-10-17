import type { useRender } from '@base-ui/react/use-render';
import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
} from 'react';

type StylingProps = { className?: string; style?: CSSProperties };

/**
 * Lets `render` swap the element but not restyle it: the `className` and
 * `style` it passes are dropped, so the component's own styles always apply.
 * Restyling goes through the `DANGEROUS_` props instead.
 */
export function withoutStyling(
  render: useRender.RenderProp | undefined,
): useRender.RenderProp | undefined {
  if (isValidElement<StylingProps>(render)) {
    return cloneElement(render, { className: undefined, style: undefined });
  }
  if (typeof render === 'function') {
    return (props, state) => {
      const element = render(props, state) as ReactElement<StylingProps>;
      if (!isValidElement<StylingProps>(element)) return element;
      const own = props as StylingProps;
      return cloneElement(element, {
        className: own.className,
        style: own.style,
      });
    };
  }
  return render;
}
