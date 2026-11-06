import { Tooltip } from '@base-ui/react/tooltip';
import { type ReactNode, useRef, useState } from 'react';
import { TooltipPopup, type TooltipPopupProps } from './tooltip-popup.tsx';

type TooltipTruncatedProps = Pick<TooltipPopupProps, 'side' | 'align'> & {
  /** Text that may be cut off, by Tailwind's `truncate` or `<TruncateMiddle>`. */
  children: ReactNode;
};

/**
 * Shows the whole text of its children on hover, but only while some of it is
 * cut off: by an element that overflows its box, e.g. one with Tailwind's
 * `truncate`, or by a `<TruncateMiddle>`. Text that fits shows no tooltip.
 */
export function TooltipTruncated({
  side,
  align,
  children,
}: TooltipTruncatedProps) {
  // Typed as Base UI's default button; it renders the span below.
  const trigger = useRef<HTMLButtonElement>(null);
  const [text, setText] = useState<string | null>(null);

  return (
    <Tooltip.Root
      open={text !== null}
      onOpenChange={(open) =>
        setText(open && trigger.current ? truncatedText(trigger.current) : null)
      }
    >
      <Tooltip.Trigger
        ref={trigger}
        // A span, not Base UI's button: it only reveals text, so it isn't a
        // control, and a click in an input's prefix still focuses the input.
        render={<span />}
        className="block max-w-full min-w-0"
      >
        {children}
      </Tooltip.Trigger>
      <TooltipPopup side={side} align={align}>
        {text}
      </TooltipPopup>
    </Tooltip.Root>
  );
}

/** The trigger's whole text when some of it is cut off, otherwise null. */
function truncatedText(trigger: HTMLElement): string | null {
  const elements = [trigger, ...trigger.querySelectorAll<HTMLElement>('*')];
  const middle = trigger.querySelector<HTMLElement>('[data-truncate-middle]');

  if (middle) {
    return middle.hasAttribute('data-truncated')
      ? (middle.dataset.fullText ?? null)
      : null;
  }

  return elements.some((element) => element.scrollWidth > element.clientWidth)
    ? trigger.textContent
    : null;
}
