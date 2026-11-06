import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';

type DialogTitleProps = {
  /** E.g. "Edit order #1001". */
  children?: ReactNode;
};

/** Names the dialog. Every dialog needs one. */
export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <Dialog.Title className="type-headline-md text-base-primary m-0 text-balance">
      {children}
    </Dialog.Title>
  );
}
