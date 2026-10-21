import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
} from 'react';

type StylingProps = { className?: string; style?: CSSProperties };

/** A `render` prop: an element, or a function of the component's props and state. */
type RenderProp<Props, State> =
  | ReactElement
  | ((props: Props, state: State) => ReactElement);

/**
 * Lets `render` swap the element but not restyle it: the `className` and
 * `style` it passes are dropped, so the component's own styles always apply.
 * Restyling goes through the `DANGEROUS_` props instead.
 *
 * Generic over the render prop's props and state, so it returns the exact
 * render type the wrapped Base UI component expects.
 */
export function withoutStyling<Props extends StylingProps, State>(
  render: RenderProp<Props, State> | undefined,
): RenderProp<Props, State> | undefined {
  if (isValidElement<StylingProps>(render)) {
    return cloneElement(render, { className: undefined, style: undefined });
  }
  if (typeof render === 'function') {
    return (props, state) => {
      const element = render(props, state) as ReactElement<StylingProps>;
      if (!isValidElement<StylingProps>(element)) return element;
      return cloneElement(element, {
        className: props.className,
        style: props.style,
      });
    };
  }
  return render;
}
