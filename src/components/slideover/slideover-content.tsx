import { type ReactNode, useRef } from 'react';
import { useScrollMaskScrollbar } from '../../utils/use-scroll-mask-scrollbar.ts';

/** The slideover's body, which scrolls between the header and footer and fades where it does. */
export function SlideoverContent({ children }: { children?: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  useScrollMaskScrollbar(content);

  return (
    <div
      ref={content}
      className="scroll-mask-y min-h-0 flex-1 overflow-y-auto px-6 pb-6"
    >
      {children}
    </div>
  );
}
