/**
 * The elevation guide (src/foundations/elevation.mdx): each elevation shadow
 * and the plane background it belongs on.
 */
export const planes: Record<string, string> = {
  'shadow-raised': 'bg-base-surface',
  'shadow-popover': 'bg-base-elevated',
  'shadow-elevated': 'bg-base-elevated',
};

export const planeBackgrounds = new Set([
  'bg-base-canvas',
  'bg-base-section',
  'bg-base-surface',
  'bg-base-elevated',
  'bg-base-overlay',
]);
