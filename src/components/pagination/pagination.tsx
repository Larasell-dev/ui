import { Button } from '@base-ui/react/button';
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
  type Updater,
} from '@tanstack/react-table';
import ArrowLeftSLine from '@iconify-icons/ri/arrow-left-s-line';
import ArrowRightSLine from '@iconify-icons/ri/arrow-right-s-line';
import SkipLeftLine from '@iconify-icons/ri/skip-left-line';
import SkipRightLine from '@iconify-icons/ri/skip-right-line';
import type { IconifyIcon } from '@iconify/types';
import type { CSSProperties } from 'react';
import { cn } from 'cn';
import { Icon } from '../icon/icon.tsx';
import { PageSizeSelect } from './page-size-select.tsx';

export type PaginationChange = {
  /** 1-based page number. */
  page: number;
  pageSize: number;
};

export type PaginationProps = PaginationChange & {
  /** Total number of rows on the server, across all pages. */
  total: number;
  /**
   * Called when the user moves to another page or changes the page size.
   * Pagination is server side: fetch the requested page and pass the new
   * `page` and `pageSize` back in.
   */
  onPaginationChange: (change: PaginationChange) => void;
  pageSizeOptions?: ReadonlyArray<number>;
  /** Disables every control, for example while the next page loads. */
  disabled?: boolean;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

// Stable inputs: TanStack only tracks pagination state here, it never sees rows.
const features = tableFeatures({ rowPaginationFeature });
const columns: never[] = [];
const data: never[] = [];

const defaultPageSizeOptions = [10, 25, 50, 100];

export function Pagination({
  page,
  pageSize,
  total,
  onPaginationChange,
  pageSizeOptions = defaultPageSizeOptions,
  disabled = false,
  DANGEROUS_className,
  DANGEROUS_style,
}: PaginationProps) {
  const pagination: PaginationState = { pageIndex: page - 1, pageSize };

  const table = useTable({
    features,
    columns,
    data,
    manualPagination: true,
    rowCount: total,
    state: { pagination },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === 'function' ? updater(pagination) : updater;
      onPaginationChange({ page: next.pageIndex + 1, pageSize: next.pageSize });
    },
  });

  const pageCount = Math.max(table.getPageCount(), 1);
  const options = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="type-caption-lg text-mauve-600 dark:text-mauve-400"
        >
          Rows per page
        </span>
        <PageSizeSelect
          value={pageSize}
          options={options}
          onValueChange={(size) => table.setPageSize(size)}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-4">
        <span
          aria-live="polite"
          className="type-caption-lg text-mauve-600 tabular-nums dark:text-mauve-400"
        >
          Page {Math.min(page, pageCount)} of {pageCount}
        </span>
        <div className="flex items-center gap-1">
          <PageButton
            label="First page"
            icon={SkipLeftLine}
            loading={disabled}
            disabled={disabled || !table.getCanPreviousPage()}
            onClick={() => table.firstPage()}
          />
          <PageButton
            label="Previous page"
            icon={ArrowLeftSLine}
            loading={disabled}
            disabled={disabled || !table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          />
          <PageButton
            label="Next page"
            icon={ArrowRightSLine}
            loading={disabled}
            disabled={disabled || !table.getCanNextPage()}
            onClick={() => table.nextPage()}
          />
          <PageButton
            label="Last page"
            icon={SkipRightLine}
            loading={disabled}
            disabled={disabled || !table.getCanLastPage()}
            onClick={() => table.lastPage()}
          />
        </div>
      </div>
    </nav>
  );
}

function PageButton({
  label,
  icon,
  loading,
  disabled,
  onClick,
}: {
  label: string;
  icon: IconifyIcon;
  /** Disabled because a page is loading, not because there's nowhere to go. */
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      aria-label={label}
      disabled={disabled}
      focusableWhenDisabled
      onClick={onClick}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center border border-mauve-200 bg-white p-2 text-mauve-950 select-none',
        'focus-visible:focus-ring not-data-disabled:hover:bg-mauve-100',
        'data-disabled:opacity-50',
        loading
          ? 'data-disabled:cursor-wait'
          : 'data-disabled:cursor-not-allowed',
        'dark:border-mauve-700 dark:bg-mauve-900 dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800',
      )}
    >
      <Icon icon={icon} />
    </Button>
  );
}
