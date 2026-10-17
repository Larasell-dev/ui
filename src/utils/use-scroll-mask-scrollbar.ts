import { useLayoutEffect, type RefObject } from 'react';

/**
 * Keeps the scrollbar of a `scroll-mask-*` element out of the fade by
 * setting `--scroll-mask-scrollbar-width` to its scrollbar's width. Not needed
 * with overlay scrollbars (0 wide), but harmless.
 */
export function useScrollMaskScrollbar(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const style = getComputedStyle(element);
      const borders =
        parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
      element.style.setProperty(
        '--scroll-mask-scrollbar-width',
        `${element.offsetWidth - element.clientWidth - borders}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}
