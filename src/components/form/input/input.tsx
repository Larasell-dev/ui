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
    // The box draws the border and the focus outline, so the prefix and suffix
    // sit inside them. Only the input's own focus outlines the box; a focused
    // button in the suffix draws its own.
    <div
      className={cn(
        'border-border flex w-full items-center gap-2 border bg-white px-3.5 text-mauve-950',
        'has-[input:focus]:focus-ring',
        'has-[input[data-invalid]]:border-red-500 has-[input[data-invalid]]:[--focus-ring-color:var(--color-red-500)]',
        'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
        'dark:bg-mauve-900 dark:text-mauve-100',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      {prefix}
      <BaseInput
        {...props}
        className={cn(
          'type-input-md min-w-0 flex-1 bg-transparent py-2.5 outline-none',
          // Only the text fades where it overflows; the prefix, suffix, and box stay solid.
          'scroll-mask-x',
          'placeholder:text-mauve-400 placeholder:select-none',
          'disabled:cursor-not-allowed',
          'dark:placeholder:text-mauve-500',
        )}
        // After the spread, so a `style` slipped past the types still loses.
        style={undefined}
      />
      {suffix}
    </div>
  );
}
