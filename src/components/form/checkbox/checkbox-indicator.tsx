import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import CheckLine from '@iconify-icons/ri/check-line';
import SubtractLine from '@iconify-icons/ri/subtract-line';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from 'cn';
import { Icon } from '../../icon/icon.tsx';

type IndicatorProps = Omit<
  ComponentProps<typeof BaseCheckbox.Root>,
  'className' | 'style' | 'children'
> & {
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * The checkbox's box. Name it by putting it in a `Checkbox.Label`, or with
 * `aria-label` when there is no visible label. It submits `value` with its form
 * while ticked, like a native checkbox.
 */
export function Indicator({
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: IndicatorProps) {
  return (
    <BaseCheckbox.Root
      {...props}
      className={cn(
        'border-border inline-flex size-5 shrink-0 cursor-pointer items-center justify-center border bg-white text-mauve-50',
        'data-checked:border-mauve-950 data-checked:bg-mauve-950',
        'data-indeterminate:border-mauve-950 data-indeterminate:bg-mauve-950',
        'focus-visible:focus-ring',
        'data-invalid:border-red-500 data-invalid:[--focus-ring-color:var(--color-red-500)]',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'dark:bg-mauve-900 dark:text-mauve-950 dark:data-checked:border-mauve-100 dark:data-checked:bg-mauve-100 dark:data-indeterminate:border-mauve-100 dark:data-indeterminate:bg-mauve-100 dark:data-invalid:border-red-500',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      <BaseCheckbox.Indicator
        className="flex text-base"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            <Icon icon={state.indeterminate ? SubtractLine : CheckLine} />
          </span>
        )}
      />
    </BaseCheckbox.Root>
  );
}
