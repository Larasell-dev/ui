import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { cn } from 'cn';

type SlideoverRootProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `Slideover.Header`, `.Content` and `.Footer`, in that order; a `<form>` around them works too. */
  children?: ReactNode;
};

/**
 * A panel that slides in from the right and fills the viewport's height,
 * leaving some space around it, e.g. for a form that adds an item to a page.
 * A dialog underneath: it traps focus and closes with Escape or a click
 * outside.
 */
export function SlideoverRoot({
  open,
  onOpenChange,
  children,
}: SlideoverRootProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          data-overlay=""
          className={cn(
            'bg-base-overlay backdrop-blur-overlay fixed inset-0 transition-opacity duration-200',
            'data-ending-style:opacity-0 data-starting-style:opacity-0',
            'motion-reduce:transition-none',
          )}
        />
        <Dialog.Popup
          className={cn(
            'border-base-subtle bg-base-elevated shadow-elevated fixed top-3 right-3 bottom-3 flex w-[calc(100%-1.5rem)] max-w-lg flex-col border bg-clip-padding outline-none',
            '[&>form]:flex [&>form]:min-h-0 [&>form]:flex-1 [&>form]:flex-col',
            'transition-[opacity,translate] duration-200 ease-out',
            'data-ending-style:translate-x-8 data-ending-style:opacity-0 data-starting-style:translate-x-8 data-starting-style:opacity-0',
            'motion-reduce:transition-none',
          )}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
