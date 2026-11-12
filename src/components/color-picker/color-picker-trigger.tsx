import { Popover } from '@base-ui/react/popover';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import {
  useColorPicker,
  type ColorPickerState,
} from './color-picker-context.ts';

type ColorPickerTriggerProps = Omit<
  ComponentProps<typeof Popover.Trigger>,
  'render' | 'className' | 'children'
> & {
  /** Replaces the button; as a function, it gets the props to spread and the colour. */
  render?:
    | ReactElement
    | ((
        props: HTMLAttributes<HTMLElement>,
        state: ColorPickerState,
      ) => ReactElement);
  className?: string | ((state: ColorPickerState) => string | undefined);
  children?: ReactNode | ((state: ColorPickerState) => ReactNode);
};

/**
 * Opens the popup. Unstyled: draw the colour yourself from the state that
 * `render`, `className` and `children` get, e.g. as an input's prefix.
 */
export function ColorPickerTrigger({
  render,
  className,
  children,
  ...props
}: ColorPickerTriggerProps) {
  const { value, open } = useColorPicker('Trigger');
  const state = { value, open };

  return (
    <Popover.Trigger
      {...props}
      data-value={value || undefined}
      className={typeof className === 'function' ? className(state) : className}
      render={
        typeof render === 'function'
          ? (triggerProps) => render(triggerProps, state)
          : render
      }
    >
      {typeof children === 'function' ? children(state) : children}
    </Popover.Trigger>
  );
}
