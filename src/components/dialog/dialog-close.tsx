import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { Button } from '../form/button/button.tsx';

type DialogCloseProps = {
  /** Defaults to "Close". */
  children?: ReactNode;
};

/** Closes the dialog without doing anything. */
export function DialogClose({ children = 'Close' }: DialogCloseProps) {
  return (
    <Dialog.Close render={<Button type="button" variant="secondary" />}>
      {children}
    </Dialog.Close>
  );
}
