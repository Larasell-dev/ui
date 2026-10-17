import { createContext, useContext } from 'react';

export type TableContextValue = {
  /** Counts a column; returns the cleanup that uncounts it. */
  registerColumn: () => () => void;
  scrollBodyToTop: () => void;
};

export const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext(part: string): TableContextValue {
  const context = useContext(TableContext);
  if (!context) throw new Error(`<Table.${part}> must be inside <Table.Root>.`);
  return context;
}
