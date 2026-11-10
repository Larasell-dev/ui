import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { Button } from '../form/button/button.tsx';

/** Closes the slideover without doing anything. Defaults to "Cancel". */
export function SlideoverClose({
  children = 'Cancel',
}: {
  children?: ReactNode;
}) {
  return (
    <Dialog.Close render={<Button type="button" variant="secondary" />}>
      {children}
    </Dialog.Close>
  );
}
