import { Combobox } from '@base-ui/react/combobox';
import CheckLine from '@iconify-icons/ri/check-line';
import { cn } from 'cn';
import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../../icon/icon.tsx';
import { useSelect } from './select-context.ts';

type SelectItemProps = {
  /** The item of `Select.Root`'s `items` this row picks. */
  item: unknown;
  disabled?: boolean;
  /**
   * What the row shows instead of the label. The check, or the checkbox with
   * `multiple`, stays.
   */
  children?: ReactNode;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/** A row of the list. Named by the item's label, whatever it shows. */
export function SelectItem({
  item,
  disabled,
  children,
  DANGEROUS_className,
  DANGEROUS_style,
}: SelectItemProps) {
  const { itemToLabel, itemToKey, multiple } = useSelect();
  const label = itemToLabel(item);

  return (
    <Combobox.Item
      value={itemToKey(item)}
      aria-label={label}
      disabled={disabled}
      className={cn(
        'group type-label-md text-base-primary flex w-full cursor-pointer items-center gap-2 px-4 py-2 outline-none select-none',
        'not-data-disabled:data-highlighted:bg-action-neutral-ghost-hover data-disabled:cursor-not-allowed data-disabled:opacity-50',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      {multiple && <SelectItemCheckbox />}
      <span className="min-w-0 flex-1 wrap-break-word">
        {children ?? label}
      </span>
      {!multiple && (
        <Combobox.ItemIndicator className="flex shrink-0">
          <Icon icon={CheckLine} />
        </Combobox.ItemIndicator>
      )}
    </Combobox.Item>
  );
}

/** A checkbox showing whether its item is picked, for lists of several. */
function SelectItemCheckbox() {
  return (
    <span
      aria-hidden
      data-testid="select-item-checkbox"
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
