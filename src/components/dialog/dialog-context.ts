import { createContext, useContext } from 'react';

type DialogContextValue = {
  /** Closes the dialog. */
  close: () => void;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog(): DialogContextValue {
  const context = useContext(DialogContext);
  if (context === null) {
    throw new Error('Dialog parts must be used inside <Dialog.Root>.');
  }
  return context;
}
