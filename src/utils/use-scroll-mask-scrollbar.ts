import { useLayoutEffect, type RefObject } from 'react';

/**
 * Keeps the scrollbars of a `scroll-mask-*` element out of the fade by setting
 * `--scroll-mask-scrollbar-left`, `-right` and `-bottom` to their sizes. A
 * vertical scrollbar sits on the left in right-to-left layouts. Overlay
 * scrollbars take no space, so all three are 0 there.
 */
export function useScrollMaskScrollbar(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const style = getComputedStyle(element);
      const borderLeft = parseFloat(style.borderLeftWidth);
      const borderRight = parseFloat(style.borderRightWidth);
      const borderTop = parseFloat(style.borderTopWidth);
      const borderBottom = parseFloat(style.borderBottomWidth);
      // clientLeft is the left border plus a scrollbar placed on the left.
      const left = element.clientLeft - borderLeft;
      const vertical =
        element.offsetWidth - element.clientWidth - borderLeft - borderRight;
      const bottom =
        element.offsetHeight - element.clientHeight - borderTop - borderBottom;
      const set = (side: string, size: number) =>
        element.style.setProperty(
          `--scroll-mask-scrollbar-${side}`,
          `${Math.max(size, 0)}px`,
        );
      set('left', left);
      set('right', vertical - left);
      set('bottom', bottom);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}
