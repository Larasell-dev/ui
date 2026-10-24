import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';

type DialogTitleProps = {
  /** E.g. "Edit order #1001". */
  children?: ReactNode;
};

/** Names the dialog. Every dialog needs one. */
export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <Dialog.Title className="type-headline-md m-0 text-balance text-mauve-950 dark:text-mauve-100">
      {children}
    </Dialog.Title>
  );
}
