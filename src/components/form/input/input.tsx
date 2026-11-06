import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
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
    >
      {prefix}
      <BaseInput
        {...props}
        data-input=""
        className={cn(
          'type-input-md min-w-0 flex-1 bg-transparent py-2.5 outline-none',
          prefix ? 'pl-2' : 'pl-3.5',
          suffix ? 'pr-2' : 'pr-3.5',
          'scroll-mask-x',
          'placeholder:text-base-tertiary placeholder:select-none',
          'disabled:cursor-not-allowed',
        )}
        // After the spread, so a `style` slipped past the types still loses.
        style={undefined}
      />
      {suffix}
    </div>
  );
}
