import type { ReactNode } from 'react';

/**
 * A bordered box without padding, so content like a table can run to its
 * edges. Wrap content in `<Inset>` to pad it; `--inset` sets how far.
 */
export function SectionCard({ children }: { children: ReactNode }) {
  return (
    <div className="border-border border bg-white [--inset:1.25rem] dark:bg-mauve-950">
      {children}
    </div>
  );
}
