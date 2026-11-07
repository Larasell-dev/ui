import { createContext, useContext, type ReactNode } from 'react';

export type SelectFilter = {
  /** The search field's placeholder, e.g. "Search sales channels". */
  placeholder?: string;
  /** Shown, centered, when the search matches no item. */
  empty?: ReactNode;
  /**
   * Called as the admin types, to filter on the server: the select then
   * shows `items` as given rather than matching them itself.
   */
  onSearch?: (query: string) => void;
};

type SelectContextValue = {
  open: boolean;
  multiple: boolean;
  selected: unknown[];
  itemToKey: (item: unknown) => string | number;
  itemToLabel: (item: unknown) => string;
  filter?: SelectFilter;
};

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelect() {
  const context = useContext(SelectContext);
  if (!context) throw new globalThis.Error('Use it inside a Select.Root.');
  return context;
}
