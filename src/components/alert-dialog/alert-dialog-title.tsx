import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { ReactNode } from 'react';

type AlertDialogTitleProps = {
  /** Phrase it as the question being asked, e.g. "Delete order #1001?". */
  children?: ReactNode;
};

/** Names the alert dialog. Every alert dialog needs one. */
export function AlertDialogTitle({ children }: AlertDialogTitleProps) {
  return (
    <AlertDialog.Title className="type-body-lg m-0 font-semibold text-mauve-950 dark:text-mauve-50">
      {children}
    </AlertDialog.Title>
  );
}
