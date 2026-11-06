/**
 * The color system (src/foundations/color.mdx): which class names paint a
 * color, and which colors are primitives that only theme.css may use.
 */

/** Utilities that take a color, longest first so `border-l` wins over `border`. */
const colorUtilities = [
  'border-x',
  'border-y',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-s',
  'border-e',
  'ring-offset',
  'inset-ring',
  'inset-shadow',
  'drop-shadow',
  'text-shadow',
  'placeholder',
  'decoration',
  'outline',
  'border',
  'divide',
  'shadow',
  'stroke',
  'accent',
  'caret',
  'fill',
  'ring',
  'text',
  'from',
  'via',
  'bg',
  'to',
];

/**
 * Tailwind's palette, the brand scale and the dark mode tint: the primitives
 * the semantic tokens are built from.
 */
const primitive =
  /^(white|black|mauve-tint|(slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|primary)-\d+)(\/.+)?$/;

/** The groups of semantic tokens, e.g. `base` in `text-base-primary`. */
const semantic = /^(base|intent|action|state|focus)(-|$)/;

/** A color written out, or a primitive's CSS variable. */
const literalColor =
  /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(|--color-(white|black|mauve-tint|(slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|primary)-\d+)\b/i;

/** The CSS variable of a primitive, e.g. `var(--color-mauve-100)`. */
export const primitiveVariable =
  /--color-(white|black|mauve-tint|(slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|primary)-\d+)\b/;

export type ColorUtility = {
  /** The utility without its value, e.g. `border-l`. */
  property: string;
  /** e.g. `mauve-100/50`, `base-primary` or `[#fff]`. */
  value: string;
  kind: 'primitive' | 'semantic' | 'literal';
};

/**
 * The color a utility paints, or `null` when it paints none: `text-sm`,
 * `border-2` and `bg-clip-padding` take no color.
 */
export function colorOf(utility: string): ColorUtility | null {
  const property = colorUtilities.find((name) =>
    utility.startsWith(`${name}-`),
  );
  if (property === undefined) return null;
  const value = utility.slice(property.length + 1);
  if (primitive.test(value)) return { property, value, kind: 'primitive' };
  if (semantic.test(value)) return { property, value, kind: 'semantic' };
  if (/^[[(]/.test(value) && literalColor.test(value)) {
    return { property, value, kind: 'literal' };
  }
  return null;
}
