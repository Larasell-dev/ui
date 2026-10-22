import type { ComponentProps } from 'react';
import { cn } from 'cn';
import { Label as FieldLabel } from '../label/label.tsx';

type LabelProps = ComponentProps<typeof FieldLabel>;

/**
 * The shared `Label`, laid out to hold a `Checkbox.Indicator` beside its text.
 * Clicking anywhere on it ticks the checkbox. Like `Label`, it must sit inside
 * a Base UI `Field.Root`, which also passes the field's invalid state to the box.
 */
export function Label({ DANGEROUS_className, ...props }: LabelProps) {
  return (
    <FieldLabel
      {...props}
      DANGEROUS_className={cn(
        'flex w-fit items-center gap-2.5',
        DANGEROUS_className,
      )}
    />
  );
}
