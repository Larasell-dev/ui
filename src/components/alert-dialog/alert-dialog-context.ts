import { createContext, useContext } from 'react';

type AlertDialogContextValue = {
  /** Closes the dialog, even while an action is processing. */
  close: () => void;
  /** Whether an action is processing, which locks the dialog open. */
  processing: boolean;
  /** Marks an action as processing; returns a function that unmarks it. */
  startProcessing: () => () => void;
};

export const AlertDialogContext = createContext<AlertDialogContextValue | null>(
  null,
);

export function useAlertDialog(): AlertDialogContextValue {
  const context = useContext(AlertDialogContext);
  if (context === null) {
    throw new Error(
      'AlertDialog parts must be used inside <AlertDialog.Root>.',
    );
  }
  return context;
}
