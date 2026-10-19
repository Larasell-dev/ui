import type { ReactNode } from 'react';

type AlertDialogActionsProps = {
  /** An `<AlertDialog.Cancel>` followed by an `<AlertDialog.Confirm>`. */
  children?: ReactNode;
};

/** The dialog's buttons, aligned to the end. */
export function AlertDialogActions({ children }: AlertDialogActionsProps) {
  return <div className="mt-6 flex justify-end gap-3">{children}</div>;
}
