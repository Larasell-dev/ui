import { createContext, useContext, type ReactNode } from 'react';

export type ComboboxFilter = {
  /** The search field's placeholder, e.g. "Search sales channels". */
  placeholder?: string;
  /** Shown, centered, when the search matches no item. */
  empty?: ReactNode;
  /**
   * Called as the admin types, to filter on the server: the combobox then
   * shows `items` as given rather than matching them itself.
   */
  onSearch?: (query: string) => void;
};

type ComboboxContextValue = {
  open: boolean;
  multiple: boolean;
  selected: unknown[];
  itemToKey: (item: unknown) => string | number;
  itemToLabel: (item: unknown) => string;
  filter?: ComboboxFilter;
};

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);

export function useCombobox() {
  const context = useContext(ComboboxContext);
  if (!context) throw new globalThis.Error('Use it inside a Combobox.Root.');
  return context;
}
