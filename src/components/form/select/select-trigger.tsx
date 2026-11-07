import { Combobox } from '@base-ui/react/combobox';
import ArrowDownSLine from '@iconify-icons/ri/arrow-down-s-line';
import { cn } from 'cn';
import { Fragment, useId, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../../icon/icon.tsx';
import { useSelect } from './select-context.ts';

type SelectInputProps = {
  /** Shown while nothing is picked. */
  placeholder?: string;
  /** Names the select when no `Field` label does. */
  'aria-label'?: string;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * The button that opens the list, looking like an `Input`: it shows the
 * picked items' labels, or the placeholder.
 */
export function SelectInput({
  placeholder,
  'aria-label': ariaLabel,
  DANGEROUS_className,
  DANGEROUS_style,
}: SelectInputProps) {
  const { selected, itemToLabel } = useSelect();

  return (
    <Combobox.Trigger
      aria-label={ariaLabel}
      className={cn(
        'type-input-md border-base-strong bg-base-surface text-base-primary flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 border py-2.5 pr-3 pl-3.5 text-start select-none',
        'focus-visible:focus-ring outline-none',
        'data-invalid:border-intent-negative data-invalid:focus-visible:focus-ring-negative',
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
      <span className="text-base-tertiary flex shrink-0">
        <Icon icon={ArrowDownSLine} />
      </span>
    </Combobox.Trigger>
  );
}

// oxlint-disable-next-line typescript/no-explicit-any -- the items' type lives on Root
type TriggerChild = ReactNode | ((selected: any[]) => ReactNode);

type SelectTriggerProps = {
  /**
   * What the button shows, or a function of the picked items, e.g.
   * `{(selected) => \`${selected.length} sales channels\`}`.
   */
  children?: TriggerChild | TriggerChild[];
  /** The button, e.g. `render={<Button variant="secondary" />}`. */
  render?: Combobox.Trigger.Props['render'];
  'aria-label'?: string;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/** A button of your own that opens the list, e.g. a toolbar's switcher. */
export function SelectTrigger({
  children,
  render,
  'aria-label': ariaLabel,
  DANGEROUS_className,
  DANGEROUS_style,
}: SelectTriggerProps) {
  const { selected } = useSelect();
  // The trigger's role is combobox, which isn't named by its content, so
  // without an aria-label it names itself by what it shows.
  const id = useId();

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
