import { createContext, useContext, type ReactNode } from 'react';

export type SelectFilter = {
  /** The search field's placeholder, e.g. "Search sales channels". */
  placeholder?: string;
  /** Shown, centered, when the search matches no item. */
  empty?: ReactNode;
};

type SelectContextValue = {
  open: boolean;
  /** Tells the root the list has finished animating out, so it shows the current items again. */
  onExitComplete: () => void;
  multiple: boolean;
  /** The picked items, in the items' order. */
  selected: unknown[];
  /** The list's items by key: while it closes, the ones it showed when it began to. */
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
