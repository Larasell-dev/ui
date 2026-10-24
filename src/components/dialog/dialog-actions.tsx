import type { ReactNode } from 'react';

type DialogActionsProps = {
  /** E.g. a `<Dialog.Close>` followed by a submit `<Button>`. */
  children?: ReactNode;
};

/** The dialog's buttons, aligned to the end. */
export function DialogActions({ children }: DialogActionsProps) {
  return <div className="mt-6 flex justify-end gap-3">{children}</div>;
}
