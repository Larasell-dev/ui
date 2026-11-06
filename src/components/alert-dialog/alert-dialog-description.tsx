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
    <AlertDialog.Description className="type-body-md text-base-secondary m-0 max-w-xs text-pretty">
      {children}
    </AlertDialog.Description>
  );
}
