import { Combobox } from '@base-ui/react/combobox';
import { useState, type ReactNode } from 'react';
import { SelectContext, type SelectFilter } from './select-context.ts';

type ValueOf<Item, Multiple> = Multiple extends true ? Item[] : Item | null;

type SelectRootProps<Item, Multiple extends boolean | undefined> = {
  /**
   * Picks several items: the value is an array, and picking an item toggles
   * it and keeps the list open. Without it, picking an item closes the list.
   */
  multiple?: Multiple;
  items: readonly Item[];
  /** Tells items apart, e.g. `(channel) => channel.channelId`. */
  itemToKey: (item: Item) => string | number;
  /** What the search matches, screen readers read and items show by default. */
  itemToLabel: (item: Item) => string;
  value?: ValueOf<Item, Multiple>;
  defaultValue?: ValueOf<Item, Multiple>;
  onValueChange?: (value: ValueOf<Item, Multiple>) => void;
  /** Adds a search field at the top of the list. Omit it for none. */
  filter?: SelectFilter;
  disabled?: boolean;
  /** A `Select.Trigger` and the `Select.Popup` it opens. */
  children?: ReactNode;
};

/**
 * Picks one item, or several with `multiple`, from a list that opens from a
 * button and can be searched.
 */
export function SelectRoot<Item, Multiple extends boolean | undefined = false>({
  multiple,
  items,
  itemToKey,
  itemToLabel,
  value: valueProp,
  defaultValue,
  onValueChange,
  filter,
  disabled,
  children,
}: SelectRootProps<Item, Multiple>) {
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? ((multiple ? [] : null) as ValueOf<Item, Multiple>),
  );
  const value = valueProp === undefined ? uncontrolledValue : valueProp;
  const selected: Item[] = Array.isArray(value)
    ? value
    : value == null
      ? []
      : [value as Item];

  return (
    <SelectContext
      value={{
        open,
        multiple: !!multiple,
        selected,
        itemToKey: itemToKey as (item: unknown) => string | number,
        itemToLabel: itemToLabel as (item: unknown) => string,
        filter,
      }}
    >
      <Combobox.Root<Item, boolean>
        multiple={!!multiple}
        items={items}
        itemToStringLabel={itemToLabel}
        isItemEqualToValue={(a, b) => itemToKey(a) === itemToKey(b)}
        // Server-side search: show the items as given.
        filter={filter?.onSearch ? null : undefined}
        onInputValueChange={(query) => filter?.onSearch?.(query)}
        value={value as Item}
        onValueChange={(next, details) => {
          // Base UI clears the value on Escape while the list is closed.
          if (details.reason === 'escape-key') {
            details.cancel();
            return;
          }
          const typed = next as ValueOf<Item, Multiple>;
          if (valueProp === undefined) setUncontrolledValue(typed);
          onValueChange?.(typed);
        }}
        open={open}
        onOpenChange={(next, details) => {
          // Several items: picking one keeps the list open, to pick more.
          if (multiple && !next && details.reason === 'item-press') {
            details.cancel();
            return;
          }
          setOpen(next);
        }}
        autoHighlight
        disabled={disabled}
      >
        {children}
      </Combobox.Root>
    </SelectContext>
  );
}
