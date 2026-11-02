/**
 * The elevation guide (src/foundations/elevation.mdx): each elevation shadow
 * and the plane background it belongs on.
 */
export const planes: Record<string, string> = {
  'shadow-raised': 'bg-surface',
  'shadow-popover': 'bg-elevated',
  'shadow-elevated': 'bg-elevated',
};

export const planeBackgrounds = new Set([
  'bg-canvas',
  'bg-sunken',
  'bg-surface',
  'bg-elevated',
  'bg-overlay',
]);
