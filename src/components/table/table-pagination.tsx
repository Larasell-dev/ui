import { Pagination, type PaginationProps } from '../pagination/pagination.tsx';
import { useTableContext } from './table-context.ts';

type TablePaginationProps = Omit<
  PaginationProps,
  'DANGEROUS_className' | 'DANGEROUS_style'
>;

/** Must be a direct child of `<Table.Root>`; it renders below the table. */
export function TablePagination({
  onPaginationChange,
  ...props
}: TablePaginationProps) {
  const { scrollBodyToTop } = useTableContext('Pagination');

  return (
    <div className="shrink-0 border-t border-mauve-200 px-4 py-3 dark:border-mauve-700">
      <Pagination
        {...props}
        onPaginationChange={(change) => {
          scrollBodyToTop();
          onPaginationChange(change);
        }}
      />
    </div>
  );
}
