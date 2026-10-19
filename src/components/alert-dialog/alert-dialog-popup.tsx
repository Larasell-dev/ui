import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { ReactNode } from 'react';
import { cn } from 'cn';
import { AlertDialogDescription } from './alert-dialog-description.tsx';
import { AlertDialogTitle } from './alert-dialog-title.tsx';

type AlertDialogPopupProps = {
  /** Shorthand for a `<AlertDialog.Title>` as the first child. */
  title?: ReactNode;
  /** Shorthand for a `<AlertDialog.Description>` after the title. */
  description?: ReactNode;
  children?: ReactNode;
};

/** The dialog itself, centered over a backdrop. */
export function AlertDialogPopup({
  title,
  description,
  children,
}: AlertDialogPopupProps) {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Backdrop
        className={cn(
          'fixed inset-0 z-40 bg-mauve-950/40 backdrop-blur-sm transition-opacity duration-200',
          'data-ending-style:opacity-0 data-starting-style:opacity-0',
          'motion-reduce:transition-none',
        )}
      />
      <AlertDialog.Popup
        className={cn(
          'border-border fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 border bg-white bg-clip-padding p-6 shadow-lg outline-none',
          'transition-[opacity,translate,scale] duration-200',
          'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
          'motion-reduce:transition-none',
          'dark:bg-mauve-900',
        )}
      >
        {title != null && <AlertDialogTitle>{title}</AlertDialogTitle>}
        {description != null && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
        {children}
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  );
}
