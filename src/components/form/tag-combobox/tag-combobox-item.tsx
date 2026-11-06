import type { CSSProperties, ReactNode } from 'react';

export type TagComboboxItemProps = {
  /** Submitted with the form while the item is picked. */
  value: string;
  /**
   * The text typing filters by and screen readers announce. Defaults to the
   * children when they are plain text; pass it when they aren't, e.g.
   * `label="Euro (EUR)"` for `Euro <span>EUR</span>`.
   */
  label?: string;
  disabled?: boolean;
  /** What the list and the item's tag show. Defaults to the label. */
  children?: ReactNode;
  /** Applied to the item's row in the list. */
  DANGEROUS_className?: string;
  /** Applied to the item's row in the list. */
  DANGEROUS_style?: CSSProperties;
};

/**
 * An option of a `TagCombobox`. It renders nothing itself: the combobox reads
 * its props, so it must be a child of the combobox, or of a fragment or array
 * there.
 */
export function TagComboboxItem(_props: TagComboboxItemProps): null {
  return null;
}
