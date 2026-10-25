import type { ReactNode } from 'react';

type DataListTitleProps = {
  /** The item's name, optionally wrapped in a `<DataList.Link>`. */
  children?: ReactNode;
  /** Shown at the end of the title row, e.g. a status or total. */
  aside?: ReactNode;
};

/** The item's heading row. Long titles and asides wrap instead of overflowing. */
export function DataListTitle({ children, aside }: DataListTitleProps) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="type-body-md min-w-0 flex-1 font-semibold break-words text-mauve-950 dark:text-mauve-100">
        {children}
      </span>
      {aside != null && (
        <span className="type-body-md max-w-1/2 shrink-0 text-right break-words text-mauve-950 dark:text-mauve-100">
          {aside}
        </span>
      )}
    </div>
  );
}
