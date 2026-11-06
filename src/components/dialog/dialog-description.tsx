import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';

type DialogDescriptionProps = {
  /** What the dialog is for. */
  children?: ReactNode;
};

export function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <Dialog.Description className="type-body-md text-base-secondary m-0 max-w-xs text-pretty">
      {children}
    </Dialog.Description>
  );
}
