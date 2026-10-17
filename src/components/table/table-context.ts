import { createContext, useContext } from 'react';

export type TableContextValue = {
  /**
   * Counts a column; returns the cleanup that uncounts it. The actions column
   * is counted apart, as it gets a fixed-width track at the end.
   */
  registerColumn: (type: 'data' | 'action') => () => void;
  scrollBodyToTop: () => void;
  /** The table's accessible name, set on `<Table.Root>`. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext(part: string): TableContextValue {
  const context = useContext(TableContext);
  if (!context) throw new Error(`<Table.${part}> must be inside <Table.Root>.`);
  return context;
}
