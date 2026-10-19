import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { ReactNode } from 'react';
import { cn } from 'cn';

type AlertDialogPopupProps = {
  children?: ReactNode;
};

/** The dialog itself, centered over a backdrop. */
export function AlertDialogPopup({ children }: AlertDialogPopupProps) {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Backdrop
        className={cn(
          'fixed inset-0 z-40 bg-black/20 transition-opacity duration-150',
          'data-ending-style:opacity-0 data-starting-style:opacity-0',
          'motion-reduce:transition-none',
        )}
      />
      <AlertDialog.Popup
        className={cn(
          'border-border fixed top-1/2 left-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-2 border bg-white p-6 shadow-lg outline-none',
          'transition-[opacity,scale] duration-150',
          'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
          'motion-reduce:transition-none',
          'dark:bg-mauve-900',
        )}
      >
        {children}
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  );
}
