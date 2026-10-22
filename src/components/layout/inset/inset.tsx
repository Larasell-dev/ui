import type { ReactNode } from 'react';

type Side = 'top' | 'right' | 'bottom' | 'left';

const padding: Record<Side, string> = {
  top: 'pt-(--inset)',
  right: 'pr-(--inset)',
  bottom: 'pb-(--inset)',
  left: 'pl-(--inset)',
};

const axes: Record<'x' | 'y', Side[]> = {
  x: ['left', 'right'],
  y: ['top', 'bottom'],
};

type InsetProps = {
  /** One side, several as an array, or `"x"` or `"y"` for an axis. Defaults to every side. */
  side?: Side | Side[] | 'x' | 'y';
  children: ReactNode;
};

/**
 * Pads its content by the surrounding `--inset`, which `<Section.Card>` sets.
 * It insets every side by default, or only `side`.
 */
export function Inset({ side, children }: InsetProps) {
  const sides = (() => {
    if (side === undefined) return Object.keys(padding) as Side[];
    if (side === 'x' || side === 'y') return axes[side];
    return [side].flat();
  })();

  return (
    <div className={sides.map((name) => padding[name]).join(' ')}>
      {children}
    </div>
  );
}
