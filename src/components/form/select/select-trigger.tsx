import { Combobox } from '@base-ui/react/combobox';
import ArrowDownSLine from '@iconify-icons/ri/arrow-down-s-line';
import { cn } from 'cn';
import { Fragment, useId, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../../icon/icon.tsx';
import { useSelect } from './select-context.ts';

// oxlint-disable-next-line typescript/no-explicit-any -- the items' type lives on Root
type TriggerChild = ReactNode | ((selected: any[]) => ReactNode);

type SelectTriggerProps = {
  /**
   * What the button shows, or a function of the picked items, e.g.
   * `{(selected) => \`${selected.length} sales channels\`}`. Defaults to the
   * picked items' labels and an arrow.
   */
  children?: TriggerChild | TriggerChild[];
  /** Shown by the default button while nothing is picked. */
  placeholder?: string;
  /** Swaps the button, e.g. `render={<Button variant="secondary" />}`. */
  render?: Combobox.Trigger.Props['render'];
  'aria-label'?: string;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/** The button that opens the list. */
export function SelectTrigger({
  children,
  placeholder,
  render,
  'aria-label': ariaLabel,
  DANGEROUS_className,
  DANGEROUS_style,
}: SelectTriggerProps) {
  const { selected, itemToLabel } = useSelect();
  // The trigger's role is combobox, which isn't named by its content, so
  // without an aria-label it names itself by what it shows.
  const id = useId();

  if (children !== undefined || render) {
    return (
      <Combobox.Trigger
        render={render}
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : id}
        className={DANGEROUS_className}
        style={DANGEROUS_style}
      >
        {[children].flat().map((child, index) => (
          <Fragment key={index}>
            {typeof child === 'function' ? child(selected) : child}
          </Fragment>
        ))}
      </Combobox.Trigger>
    );
  }

  return (
    <Combobox.Trigger
      aria-label={ariaLabel}
      className={cn(
        'type-label-md border-base-subtle bg-action-neutral-secondary-default text-base-primary inline-flex min-w-18 cursor-pointer items-center justify-between gap-2 border py-1.5 pr-2 pl-3 select-none',
        'focus-visible:focus-ring not-data-disabled:hover:bg-action-neutral-secondary-hover data-popup-open:bg-action-neutral-secondary-hover',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      <span
        className={cn(
          'min-w-0 truncate',
          selected.length === 0 && 'text-base-tertiary',
        )}
      >
        {selected.length === 0
          ? placeholder
          : selected.map(itemToLabel).join(', ')}
      </span>
      <span className="text-base-tertiary flex">
        <Icon icon={ArrowDownSLine} />
      </span>
    </Combobox.Trigger>
  );
}
