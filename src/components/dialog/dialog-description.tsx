import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';

type DialogDescriptionProps = {
  /** What the dialog is for. */
  children?: ReactNode;
};

export function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <Dialog.Description className="type-body-md m-0 max-w-xs text-pretty text-mauve-600 dark:text-mauve-400">
      {children}
    </Dialog.Description>
  );
}
