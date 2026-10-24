import { Pagination, type PaginationProps } from '../pagination/pagination.tsx';
import { useTableContext } from './table-context.ts';

type TablePaginationProps = Omit<
  PaginationProps,
  'DANGEROUS_className' | 'DANGEROUS_style'
>;

/** Goes inside `<Table.Root>`, after `<Table.Content>`. */
export function TablePagination({
  onPaginationChange,
  ...props
}: TablePaginationProps) {
  const { scrollBodyToTop } = useTableContext('Pagination');

  return (
    <div className="border-border shrink-0 border-t px-6 py-3">
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
