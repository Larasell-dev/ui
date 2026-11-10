import type { ReactNode } from 'react';

/**
 * Stays at the bottom below the scrolling content, behind a top border and
 * one elevation level lower than it. Usually holds `Slideover.Actions`.
 */
export function SlideoverFooter({ children }: { children?: ReactNode }) {
  return (
    <div className="border-base-subtle bg-base-section shrink-0 border-t px-6 py-4">
      {children}
    </div>
  );
}
