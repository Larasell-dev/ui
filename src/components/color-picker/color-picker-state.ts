import {
  hexAlpha,
  hexToHsv,
  hsvToRgb,
  isHex,
  rgbToHex,
  type Hsv,
} from './color.ts';

/**
 * The colour being picked. With one, its hex is always the one its hsv and alpha make, so the
 * two can't disagree; without one, only the hue is kept, so picking again starts from it.
 */
export type ColorState =
  | { kind: 'empty'; hue: number }
  | { kind: 'color'; hex: string; hsv: Hsv; alpha: number };

export type ColorEvent =
  /** From the area and sliders. */
  | { type: 'picked'; hsv: Hsv; alpha: number }
  /** From a field, as any text; anything that isn't a colour is turned away. */
  | { type: 'typed'; hex: string }
  | { type: 'cleared' }
  /** The value passed to a controlled root. */
  | { type: 'synced'; hex: string };

/** The colour as #rrggbb or #rrggbbaa in lowercase, or "" for none or for text that isn't one. */
export const normalize = (value: string | undefined) =>
  value && isHex(value) ? value.toLowerCase() : '';

export const valueOf = (state: ColorState) =>
  state.kind === 'color' ? state.hex : '';

const picked = (hsv: Hsv, alpha: number): ColorState => ({
  kind: 'color',
  hex: rgbToHex(hsvToRgb(hsv), alpha),
  hsv,
  alpha,
});

/** Sets the colour to a hex, keeping the picked hsv when it already makes it, e.g. a hue on grey. */
function toHex(state: ColorState, hex: string): ColorState {
  if (hex === '') return clear(state);
  if (hex === valueOf(state)) return state;
  return picked(hexToHsv(hex), hexAlpha(hex));
}

const clear = (state: ColorState): ColorState =>
  state.kind === 'empty' ? state : { kind: 'empty', hue: state.hsv.h };

export function colorReducer(state: ColorState, event: ColorEvent): ColorState {
  switch (event.type) {
    case 'picked':
      return picked(event.hsv, event.alpha);
    case 'cleared':
      return clear(state);
    case 'typed': {
      // Text that isn't a colour, or is empty, isn't one to set: clearing is its own event.
      const hex = normalize(event.hex);
      return hex === '' ? state : toHex(state, hex);
    }
    case 'synced':
      return toHex(state, normalize(event.hex));
  }
}

export const initialColor = (value: string): ColorState =>
  toHex({ kind: 'empty', hue: 0 }, normalize(value));

/** The hsv and alpha the popup shows: black at the kept hue while there's no colour. */
export const pickedOf = (state: ColorState) =>
  state.kind === 'color'
    ? { hsv: state.hsv, alpha: state.alpha }
    : { hsv: { h: state.hue, s: 0, v: 0 }, alpha: 1 };
