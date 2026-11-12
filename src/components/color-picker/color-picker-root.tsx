import { Popover } from '@base-ui/react/popover';
import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import type { Hsv } from './color.ts';
import {
  ColorPickerContext,
  defaultColorPickerLabels,
  type ColorPickerLabels,
} from './color-picker-context.ts';
import {
  colorReducer,
  initialColor,
  normalize,
  pickedOf,
  valueOf,
  type ColorEvent,
} from './color-picker-state.ts';

type ColorPickerRootProps = {
  /** The colour as #rrggbb or #rrggbbaa, or "" for none. Pass it to control the picker. */
  value?: string;
  /** The starting colour when uncontrolled. */
  defaultValue?: string;
  /** Called with the new colour in lowercase: #rrggbb, #rrggbbaa while not opaque, or "". */
  onValueChange?: (value: string) => void;
  /** Submits the colour with the surrounding form under this name. */
  name?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The accessible names of the popup's sliders, fields and copy buttons, to translate them. */
  labels?: Partial<ColorPickerLabels>;
  children?: ReactNode;
};

/**
 * A colour picker: a `<ColorPicker.Trigger>` that opens the `<ColorPicker.Popup>`, and
 * optionally a `<ColorPicker.Input>` to type the colour. Controlled with `value`, or
 * uncontrolled with `defaultValue`; with `name`, it submits the colour with its form.
 */
export function ColorPickerRoot({
  value: controlled,
  defaultValue,
  onValueChange,
  name,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  labels,
  children,
}: ColorPickerRootProps) {
  const [color, dispatch] = useReducer(
    colorReducer,
    controlled ?? defaultValue ?? '',
    initialColor,
  );
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const open = controlledOpen ?? ownOpen;

  // Controlled, the picker shows the value it's given, also when a change was turned down.
  if (controlled !== undefined && normalize(controlled) !== valueOf(color)) {
    dispatch({ type: 'synced', hex: controlled });
  }
  const value = valueOf(color);

  const hidden = useRef<HTMLInputElement>(null);
  // The value the user last set; reaching it is the user's change, not the app's.
  const userValue = useRef<string | null>(null);
  // Forms, e.g. Inertia's, notice changes by input events, which hidden inputs don't fire.
  useEffect(() => {
    if (userValue.current !== value) return;
    userValue.current = null;
    hidden.current?.dispatchEvent(new Event('input', { bubbles: true }));
  }, [value]);

  const change = (event: ColorEvent) => {
    const next = valueOf(colorReducer(color, event));
    dispatch(event);
    if (next === value) return;
    userValue.current = next;
    onValueChange?.(next);
  };
  const { hsv, alpha } = pickedOf(color);

  return (
    <ColorPickerContext.Provider
      value={{
        value,
        open,
        labels: { ...defaultColorPickerLabels, ...labels },
        hsv,
        alpha,
        setValue: (next) =>
          change(
            next === '' ? { type: 'cleared' } : { type: 'typed', hex: next },
          ),
        setColor: (hsv: Hsv, alpha: number) =>
          change({ type: 'picked', hsv, alpha }),
      }}
    >
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          if (controlledOpen === undefined) setOwnOpen(next);
          onOpenChange?.(next);
        }}
      >
        {children}
      </Popover.Root>
      {name && <input ref={hidden} type="hidden" name={name} value={value} />}
    </ColorPickerContext.Provider>
  );
}
