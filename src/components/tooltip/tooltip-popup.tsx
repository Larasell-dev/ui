import { Tooltip } from '@base-ui/react/tooltip';
import type { ReactNode } from 'react';
import { cn } from 'cn';

type TooltipPopupProps = Pick<Tooltip.Positioner.Props, 'side' | 'align'> & {
  children?: ReactNode;
};

/**
 * The tooltip itself: a black label with an arrow pointing at its trigger.
 * Base UI's portal, positioner, popup and arrow in one, styled and not
 * restylable, so it takes no `className`, `style` or `render`.
 */
export function TooltipPopup({ side, align, children }: TooltipPopupProps) {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner side={side} align={align} sideOffset={8}>
        <Tooltip.Popup
          className={cn(
            'bg-base-inverse text-base-inverse relative max-w-xs origin-(--transform-origin) px-2 py-1 text-sm',
            'transition-[opacity,scale] duration-150',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-instant:transition-none motion-reduce:transition-none',
          )}
        >
          <Tooltip.Arrow
            className={cn(
              'bg-base-inverse size-2 rotate-45',
              'data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=right]:-left-1 data-[side=top]:-bottom-1',
            )}
          />
          {children}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  );
}
