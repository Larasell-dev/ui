import type { ReactNode } from 'react';

/** What the slideover is for; scrolls on its own when it doesn't fit. */
export function SlideoverContent({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>
  );
}
