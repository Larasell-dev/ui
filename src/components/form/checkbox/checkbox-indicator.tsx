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
        'border-base-strong bg-base-surface text-action-neutral-on-color inline-flex size-5 shrink-0 cursor-pointer items-center justify-center border',
        'data-checked:border-action-neutral-primary-default data-checked:bg-action-neutral-primary-default',
        'data-indeterminate:border-action-neutral-primary-default data-indeterminate:bg-action-neutral-primary-default',
        'focus-visible:focus-ring',
        'data-invalid:border-intent-negative data-invalid:focus-ring-negative',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
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
