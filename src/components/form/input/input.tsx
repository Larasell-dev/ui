import { Input as BaseInput } from '@base-ui/react/input';
import type {
  ComponentProps,
  CSSProperties,
  MouseEvent,
  ReactNode,
} from 'react';
import { cn } from 'cn';

type InputProps = Omit<
  ComponentProps<typeof BaseInput>,
  'className' | 'style' | 'prefix'
> & {
  /** Rendered inside the input's box, before the text, e.g. an icon or `https://`. */
  prefix?: ReactNode;
  /** Rendered inside the input's box, after the text, e.g. a unit or a button. */
  suffix?: ReactNode;
  /** Applied to the box around the input, prefix, and suffix. */
  DANGEROUS_className?: string;
  /** Applied to the box around the input, prefix, and suffix. */
  DANGEROUS_style?: CSSProperties;
};

export function Input({
  prefix,
  suffix,
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        // No gap and no padding next to the input: that space would belong to
        // the box, not the input, and clicking it wouldn't focus the input.
        // The input pads itself instead; the box pads only beside an affix.
        'border-base-strong bg-base-surface text-base-primary flex w-full items-center border',
        // Text in the prefix and suffix takes the input's size and line height,
        // so their baselines line up with the input's text.
        'type-input-md',
        prefix && 'pl-3.5',
        suffix && 'pr-3.5',
        // Only its own input, a direct child marked with data-input, styles the
        // box; inputs nested in the prefix or suffix, e.g. a select, don't.
        'has-[>[data-input]:focus]:focus-ring',
        'has-[>[data-input][data-invalid]]:border-intent-negative has-[>[data-input][data-invalid]]:focus-ring-negative',
        'has-[>[data-input]:disabled]:cursor-not-allowed has-[>[data-input]:disabled]:opacity-50',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
      onMouseDown={focusInput}
    >
      {prefix != null && (
        <span data-input-prefix="" className={cn(affix, 'text-end')}>
          {prefix}
        </span>
      )}
      <BaseInput
        {...props}
        data-input=""
        className={cn(
          'type-input-md min-w-0 flex-1 bg-transparent py-2.5 outline-none',
          prefix ? 'pl-2' : 'pl-3.5',
          suffix ? 'pr-2' : 'pr-3.5',
          // Text beside it, <Input.Text>, reads as part of the value, e.g. a
          // URL's host before its path, so the input drops the gap to it.
          '[[data-input-prefix]:has([data-input-text])+&]:pl-0',
          '[&:has(+[data-input-suffix]_[data-input-text])]:pr-0',
          'scroll-mask-x',
          'placeholder:text-base-tertiary placeholder:select-none',
          'disabled:cursor-not-allowed',
        )}
        // After the spread, so a `style` slipped past the types still loses.
        style={undefined}
      />
      {suffix != null && (
        <span data-input-suffix="" className={cn(affix, 'text-start')}>
          {suffix}
        </span>
      )}
    </div>
  );
}

// Each affix takes at most a third of the box, so the input keeps at least a
// third, and claims all the room the affixes don't need. Text cut to fit, e.g.
// by <TruncateMiddle>, keeps to the input's side, so it never leaves a gap.
// It's as tall as the box, so a button in it with self-stretch fills the box.
const affix = 'flex min-w-0 max-w-1/3 shrink-0 items-center self-stretch';

type InputTextProps = {
  children?: ReactNode;
};

/**
 * Text in a prefix or suffix, e.g. `https://` or a unit, muted beside the
 * value. The input drops its gap to it, and long text is cut off with an
 * ellipsis; wrap it in `<Tooltip.Truncated>` to show all of it on hover, or put
 * a `<TruncateMiddle>` inside to cut off the middle instead.
 */
function InputText({ children }: InputTextProps) {
  return (
    <span data-input-text="" className="text-base-tertiary block truncate">
      {children}
    </span>
  );
}

Input.Text = InputText;

/**
 * Clicking the prefix or suffix focuses the input, as clicking a label does,
 * unless it lands on something that handles clicks itself, e.g. a button.
 */
function focusInput(event: MouseEvent<HTMLDivElement>) {
  const input = event.currentTarget.querySelector<HTMLInputElement>(
    ':scope > [data-input]',
  );
  const target = event.target as Element;
  // Only inside the box: a page's own focusable wrapper, e.g. a main element
  // with tabindex="-1", isn't something the click was meant for.
  const control = target.closest(
    'button, a, input, select, textarea, [tabindex]',
  );

  if (
    !input ||
    input.disabled ||
    (control && event.currentTarget.contains(control))
  ) {
    return;
  }

  // Keeps the focus from going to the box and the text from being selected.
  event.preventDefault();
  input.focus();
}
