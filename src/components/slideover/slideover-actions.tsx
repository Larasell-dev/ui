import type { ReactNode } from 'react';

/** The footer's buttons, aligned to the end, e.g. `Slideover.Close` and a submit `Button`. */
export function SlideoverActions({ children }: { children?: ReactNode }) {
  return <div className="flex items-center justify-end gap-3">{children}</div>;
}
