import { Combobox } from '@base-ui/react/combobox';
import CheckLine from '@iconify-icons/ri/check-line';
import { cn } from 'cn';
import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../../icon/icon.tsx';
import { useCombobox } from './combobox-context.ts';

type ComboboxItemProps = {
  /** The item of `Combobox.Root`'s `items` this row picks. */
  item: unknown;
  disabled?: boolean;
  /** What the row shows. Defaults to the label and a check while picked. */
  children?: ReactNode;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/** A row of the list. Named by the item's label, whatever it shows. */
export function ComboboxItem({
  item,
  disabled,
  children,
  DANGEROUS_className,
  DANGEROUS_style,
}: ComboboxItemProps) {
  const { itemToLabel } = useCombobox();
  const label = itemToLabel(item);

  return (
    <Combobox.Item
      value={item}
      aria-label={label}
      disabled={disabled}
      className={cn(
        'group type-label-md text-base-primary flex w-full cursor-pointer items-center gap-2 px-4 py-1.5 outline-none select-none',
        'not-data-disabled:data-highlighted:bg-action-neutral-ghost-hover data-disabled:cursor-not-allowed data-disabled:opacity-50',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      {children ?? (
        <>
          <span className="min-w-0 flex-1 wrap-break-word">{label}</span>
          <Combobox.ItemIndicator className="flex shrink-0">
            <Icon icon={CheckLine} />
          </Combobox.ItemIndicator>
        </>
      )}
    </Combobox.Item>
  );
}

/** A checkbox showing whether its item is picked, for lists of several. */
export function ComboboxItemCheckbox() {
  return (
    <span
      aria-hidden
      data-testid="combobox-item-checkbox"
      className={cn(
        'border-base-strong bg-base-surface text-action-neutral-on-color inline-flex size-5 shrink-0 items-center justify-center border',
        'group-data-selected:border-action-neutral-primary-default group-data-selected:bg-action-neutral-primary-default',
      )}
    >
      <Combobox.ItemIndicator className="flex text-base">
        <Icon icon={CheckLine} />
      </Combobox.ItemIndicator>
    </span>
  );
}
