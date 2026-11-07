import { createContext, useContext, type ReactNode } from 'react';

export type SelectFilter = {
  /** The search field's placeholder, e.g. "Search sales channels". */
  placeholder?: string;
  /** Shown, centered, when the search matches no item. */
  empty?: ReactNode;
};

type SelectContextValue = {
  open: boolean;
  multiple: boolean;
  /** The picked items, in the items' order. */
  selected: unknown[];
  byKey: Map<string, unknown>;
  itemToKey: (item: unknown) => string;
  itemToLabel: (item: unknown) => string;
  filter?: SelectFilter;
};

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelect() {
  const context = useContext(SelectContext);
  if (!context) throw new globalThis.Error('Use it inside a Select.Root.');
  return context;
}
