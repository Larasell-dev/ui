import { createContext, useContext } from 'react';
import type { Hsv } from './color.ts';

export type ColorPickerState = {
  /** The colour as #rrggbb, or #rrggbbaa while not opaque, in lowercase; "" for none. */
  value: string;
  open: boolean;
};

/** The picker's accessible names, in English unless the app passes its own to the root. */
export const defaultColorPickerLabels = {
  area: 'Saturation and brightness',
  hue: 'Hue',
  alpha: 'Alpha',
  copyLch: 'Copy LCH',
  lchLightness: 'LCH lightness',
  lchChroma: 'LCH chroma',
  lchHue: 'LCH hue',
  copyHsl: 'Copy HSL',
  hslHue: 'HSL hue',
  hslSaturation: 'HSL saturation',
  hslLightness: 'HSL lightness',
  copyRgb: 'Copy RGB',
  red: 'Red',
  green: 'Green',
  blue: 'Blue',
  copyHex: 'Copy hex',
  hex: 'Hex',
  alphaPercentage: 'Alpha percentage',
};

export type ColorPickerLabels = typeof defaultColorPickerLabels;

type ColorPickerContextValue = ColorPickerState & {
  labels: ColorPickerLabels;
  /** The colour being picked; kept apart from the value so hue survives grey and black. */
  hsv: Hsv;
  /** 0–1. */
  alpha: number;
  setValue: (value: string) => void;
  /** Sets the colour from the picker, keeping the hue when it's grey or black. */
  setColor: (hsv: Hsv, alpha: number) => void;
};

export const ColorPickerContext = createContext<ColorPickerContextValue | null>(
  null,
);

export function useColorPicker(part: string) {
  const context = useContext(ColorPickerContext);
  if (!context)
    throw new Error(`<ColorPicker.${part}> must be inside <ColorPicker.Root>.`);
  return context;
}
