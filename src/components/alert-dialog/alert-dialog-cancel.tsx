import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { ReactNode } from 'react';
import { Button } from '../form/button/button.tsx';
import { useAlertDialog } from './alert-dialog-context.ts';

type AlertDialogCancelProps = {
  /** Defaults to "Cancel". */
  children?: ReactNode;
};

/** Closes the dialog without doing anything. Disabled while processing. */
export function AlertDialogCancel({
  children = 'Cancel',
}: AlertDialogCancelProps) {
  const { processing } = useAlertDialog();

  return (
    <AlertDialog.Close
      disabled={processing}
      render={
        <Button type="button" variant="secondary" disabled={processing} />
      }
    >
      {children}
    </AlertDialog.Close>
  );
}
