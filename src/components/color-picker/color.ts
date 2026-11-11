/** Hue 0–360, saturation and brightness 0–100. */
export type Hsv = { h: number; s: number; v: number };
/** Channels 0–255. */
export type Rgb = { r: number; g: number; b: number };
/** Hue 0–360, saturation and lightness 0–100. */
export type Hsl = { h: number; s: number; l: number };
/** OKLCH: lightness 0–100, chroma 0–~0.4, hue 0–360. */
export type Lch = { l: number; c: number; h: number };

const HEX = /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Whether the text is a colour such as #1a2b3c, or #1a2b3c80 with an alpha. */
export const isHex = (text: string) => HEX.test(text);

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const byte = (n: number) =>
  Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, '0');

export function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1, 7), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** The alpha, 0–1, of a hex colour; 1 without one. */
export const hexAlpha = (hex: string) =>
  hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1;

/** #rrggbb, or #rrggbbaa while it isn't fully opaque. */
export function rgbToHex({ r, g, b }: Rgb, alpha = 1): string {
  const a = Math.round(clamp(alpha, 0, 1) * 255);
  return `#${byte(r)}${byte(g)}${byte(b)}${a === 255 ? '' : byte(a)}`;
}

function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const d = max - Math.min(rr, gg, bb);
  return {
    h: hue(rr, gg, bb, max, d),
    s: max === 0 ? 0 : (d / max) * 100,
    v: max * 100,
  };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return (
      (v / 100) * (1 - (s / 100) * Math.max(0, Math.min(k, 4 - k, 1))) * 255
    );
  };
  return { r: f(5), g: f(3), b: f(1) };
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  const l = (max + min) / 2;
  return {
    h: hue(rr, gg, bb, max, d),
    s: d === 0 ? 0 : (d / (1 - Math.abs(2 * l - 1))) * 100,
    l: l * 100,
  };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return (l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255;
  };
  return { r: f(0), g: f(8), b: f(4) };
}

function hue(r: number, g: number, b: number, max: number, d: number) {
  if (d === 0) return 0;
  const h =
    max === r
      ? ((g - b) / d) % 6
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toGamma = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

export function rgbToLch({ r, g, b }: Rgb): Lch {
  const [lr, lg, lb] = [r, g, b].map((c) => toLinear(c / 255)) as [
    number,
    number,
    number,
  ];
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.hypot(A, B);
  return {
    l: L * 100,
    c,
    h: c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360,
  };
}

/** Colours outside sRGB are clipped into it. */
export function lchToRgb({ l, c, h }: Lch): Rgb {
  const L = l / 100;
  const A = c * Math.cos((h * Math.PI) / 180);
  const B = c * Math.sin((h * Math.PI) / 180);
  const l_ = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m_ = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s_ = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((c) => clamp(toGamma(clamp(c, 0, 1)) * 255, 0, 255)) as [
    number,
    number,
    number,
  ];
  return { r: rgb[0], g: rgb[1], b: rgb[2] };
}

export const hexToHsv = (hex: string) => rgbToHsv(hexToRgb(hex));
