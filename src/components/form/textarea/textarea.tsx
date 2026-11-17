import { Field } from '@base-ui/react/field';
import { cn } from 'cn';
import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
} from 'react';
import { useScrollMaskScrollbar } from '../../../utils/use-scroll-mask-scrollbar.ts';

type TextareaProps = Omit<ComponentProps<'textarea'>, 'className' | 'style'> & {
  /** E.g. another `max-h-*` to change how tall it grows. */
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * A multi-line text field that looks like an `Input`. It grows with its text up
 * to `max-h-60`, then scrolls with its edges faded. In a `Field`, its label and
 * error apply to it.
 */
export function Textarea({
  rows = 2,
  onInput,
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  // Some browsers fade the bottom even when nothing scrolls, so the fade only
  // applies while the text overflows.
  const [overflowing, setOverflowing] = useState(false);
  useScrollMaskScrollbar(ref);
  const resize = (textarea: HTMLTextAreaElement) => {
    fit(textarea);
    setOverflowing(textarea.scrollHeight > textarea.clientHeight);
  };

  // Fits its first text, and fits again when its form resets it.
  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    resize(textarea);
    const form = textarea.form;
    const refit = () => requestAnimationFrame(() => resize(textarea));
    form?.addEventListener('reset', refit);
    return () => form?.removeEventListener('reset', refit);
  }, []);

  return (
    <Field.Control
      render={
        <textarea
          rows={rows}
          onInput={(event) => {
            resize(event.currentTarget);
            onInput?.(event);
          }}
          {...props}
        />
      }
      ref={ref}
      className={cn(
        'type-input-md border-base-strong bg-base-surface text-base-primary placeholder:text-base-tertiary placeholder:select-none',
        'focus:focus-ring max-h-60 w-full resize-none overflow-y-auto border px-3.5 py-2.5 outline-none',
        'data-invalid:border-intent-negative data-invalid:focus-visible:focus-ring-negative',
        'disabled:cursor-not-allowed disabled:opacity-50',
        overflowing && 'scroll-mask-y',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    />
  );
}

/** As tall as its text, which max-height caps; the box is border-box, so add the border. */
function fit(textarea: HTMLTextAreaElement) {
  textarea.style.height = 'auto';
  const border = textarea.offsetHeight - textarea.clientHeight;
  textarea.style.height = `${textarea.scrollHeight + border}px`;
}
