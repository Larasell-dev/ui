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
        'border-border flex w-full items-center gap-2 border bg-white px-3.5 text-mauve-950',
        // Only its own input, a direct child marked with data-input, styles the
        // box; inputs nested in the prefix or suffix, e.g. a select, don't.
        'has-[>[data-input]:focus]:focus-ring',
        'has-[>[data-input][data-invalid]]:border-red-500 has-[>[data-input][data-invalid]]:[--focus-ring-color:var(--color-red-500)]',
        'has-[>[data-input]:disabled]:cursor-not-allowed has-[>[data-input]:disabled]:opacity-50',
        'dark:bg-mauve-900 dark:text-mauve-100',
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
