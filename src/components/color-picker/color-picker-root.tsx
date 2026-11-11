import { Popover } from '@base-ui/react/popover';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  hexAlpha,
  hexToHsv,
  hsvToRgb,
  isHex,
  rgbToHex,
  type Hsv,
} from './color.ts';
import {
  ColorPickerContext,
  defaultColorPickerLabels,
  type ColorPickerLabels,
} from './color-picker-context.ts';

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

const normalize = (value: string | undefined) =>
  value && isHex(value) ? value.toLowerCase() : '';
const BLACK: Hsv = { h: 0, s: 0, v: 0 };

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
  const [own, setOwn] = useState(() => normalize(defaultValue));
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const value = controlled === undefined ? own : normalize(controlled);
  const open = controlledOpen ?? ownOpen;

  // Follows the value, unless it already is the picked colour, e.g. a hue on grey.
  const [color, setColorState] = useState(() => ({
    hsv: value ? hexToHsv(value) : BLACK,
    alpha: value ? hexAlpha(value) : 1,
  }));
  const [seen, setSeen] = useState(value);
  if (seen !== value) {
    setSeen(value);
    if (value && rgbToHex(hsvToRgb(color.hsv), color.alpha) !== value) {
      setColorState({ hsv: hexToHsv(value), alpha: hexAlpha(value) });
    }
  }

  const hidden = useRef<HTMLInputElement>(null);
  const changed = useRef(false);
  // Forms, e.g. Inertia's, notice changes by input events, which hidden inputs don't fire.
  useEffect(() => {
    if (!changed.current) return;
    changed.current = false;
    hidden.current?.dispatchEvent(new Event('input', { bubbles: true }));
  }, [value]);

  const setValue = (next: string) => {
    const normalized = normalize(next);
    if (normalized === value) return;
    changed.current = true;
    if (controlled === undefined) setOwn(normalized);
    onValueChange?.(normalized);
  };

  return (
    <ColorPickerContext.Provider
      value={{
        value,
        open,
        labels: { ...defaultColorPickerLabels, ...labels },
        hsv: color.hsv,
        alpha: color.alpha,
        setValue,
        setColor: (hsv, alpha) => {
          setColorState({ hsv, alpha });
          setValue(rgbToHex(hsvToRgb(hsv), alpha));
        },
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
