import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { ReactNode } from 'react';

type AlertDialogDescriptionProps = {
  /** What happens if the user goes ahead. */
  children?: ReactNode;
};

export function AlertDialogDescription({
  children,
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialog.Description className="type-body-md m-0 max-w-xs text-mauve-600 dark:text-mauve-400">
      {children}
    </AlertDialog.Description>
  );
}
