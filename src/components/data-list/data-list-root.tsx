import type { CSSProperties, ReactNode } from 'react';
import { cn } from 'cn';

type DataListRootProps = {
  /** Accessible name of the list. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** `<DataList.Item>`s. */
  children?: ReactNode;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * A vertical list of records, each showing its fields as label/value pairs.
 * The narrow-screen counterpart of `<Table>`: nothing scrolls sideways, every
 * text wraps within the item. Like the table it has no outer border.
 */
export function DataListRoot({
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  DANGEROUS_className,
  DANGEROUS_style,
}: DataListRootProps) {
  return (
    <ul
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'm-0 flex w-full list-none flex-col bg-white p-0 dark:bg-mauve-900',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      {children}
    </ul>
  );
}
