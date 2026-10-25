import type { ReactNode } from 'react';

type TableCellProps = {
  children?: ReactNode;
  /**
   * Shown before the value, e.g. a `<Thumbnail>`. It stays outside a
   * `<Table.Link>` in `children`, so it isn't part of the link's name.
   */
  media?: ReactNode;
};

export function TableCell({ children, media }: TableCellProps) {
  return (
    <td
      role="cell"
      className="type-body-md truncate px-6 py-3 text-mauve-950 dark:text-mauve-100"
    >
      {media == null ? (
        children
      ) : (
        <span className="flex items-center gap-3">
          {media}
          <span className="min-w-0 truncate">{children}</span>
        </span>
      )}
    </td>
  );
}
