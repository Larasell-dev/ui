import type { ReactNode } from 'react';
import { SelectItem } from './select-item.tsx';
import { SelectPopup } from './select-popup.tsx';
import { SelectRoot, type SelectRootProps } from './select-root.tsx';
import { SelectInput } from './select-trigger.tsx';
import * as parts from './select.parts.ts';

type SelectProps<Item, Multiple extends boolean | undefined> = Omit<
  SelectRootProps<Item, Multiple>,
  'children'
> & {
  /** Shown while nothing is picked. */
  placeholder?: string;
  /** Names the select when no `Field` label does. */
  'aria-label'?: string;
  /** What each row shows instead of the item's label. */
  renderItem?: (item: Item) => ReactNode;
};

/**
 * A select that looks like an input: `Select.Root` with a `Select.Input`
 * and a `Select.Popup`. Compose the parts for a button of your own.
 */
function SimpleSelect<Item, Multiple extends boolean | undefined = false>({
  placeholder,
  'aria-label': ariaLabel,
  renderItem,
  ...props
}: SelectProps<Item, Multiple>) {
  return (
    <SelectRoot {...props}>
      <SelectInput placeholder={placeholder} aria-label={ariaLabel} />
      <SelectPopup>
        {renderItem &&
          ((item: Item) => (
            <SelectItem item={item}>{renderItem(item)}</SelectItem>
          ))}
      </SelectPopup>
    </SelectRoot>
  );
}

export const Select = Object.assign(SimpleSelect, parts);
