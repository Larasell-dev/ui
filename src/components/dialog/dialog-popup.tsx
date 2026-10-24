import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { cn } from 'cn';
import { useDialog } from './dialog-context.ts';
import { DialogDescription } from './dialog-description.tsx';
import { DialogTitle } from './dialog-title.tsx';

type DialogPopupProps = {
  /** Shorthand for a `<Dialog.Title>` as the first child. */
  title?: ReactNode;
  /** Shorthand for a `<Dialog.Description>` after the title. */
  description?: ReactNode;
  /** Content after the title and description, or a function that gets `close`, e.g. for a form's `onSuccess`. */
  children?: ReactNode | ((dialog: { close: () => void }) => ReactNode);
};

/** The dialog itself, centered over a backdrop. */
export function DialogPopup({
  title,
  description,
  children,
}: DialogPopupProps) {
  const { close } = useDialog();

  return (
    <Dialog.Portal>
      <Dialog.Backdrop
        className={cn(
          'fixed inset-0 z-40 bg-mauve-950/40 backdrop-blur-sm transition-opacity duration-200',
          'data-ending-style:opacity-0 data-starting-style:opacity-0',
          'motion-reduce:transition-none',
        )}
      />
      <Dialog.Popup
        className={cn(
          'border-border fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 border bg-white bg-clip-padding p-6 shadow-lg outline-none',
          'transition-[opacity,translate,scale] duration-200',
          'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
          'motion-reduce:transition-none',
          'dark:bg-mauve-900',
        )}
      >
        {title != null && <DialogTitle>{title}</DialogTitle>}
        {description != null && (
          <DialogDescription>{description}</DialogDescription>
        )}
        {typeof children === 'function' ? children({ close }) : children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}
