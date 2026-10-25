import type { ReactNode } from 'react';

type DataListFieldProps = {
  /** What the value is, usually the matching table column's heading. */
  label: ReactNode;
  children?: ReactNode;
};

/** One label/value pair. Long labels and values wrap instead of overflowing. */
export function DataListField({ label, children }: DataListFieldProps) {
  return (
    <dl className="m-0 grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
      <dt className="type-body-md break-words text-mauve-600 dark:text-mauve-400">
        {label}
      </dt>
      <dd className="type-body-md m-0 break-words text-mauve-950 dark:text-mauve-100">
        {children}
      </dd>
    </dl>
  );
}
