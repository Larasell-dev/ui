import { Dialog } from '@base-ui/react/dialog';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { DialogContext } from './dialog-context.ts';

type DialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

/**
 * Shows content in a window over the page, e.g. a form. Unlike an alert
 * dialog, it closes when clicking outside or pressing Escape.
 */
export function DialogRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const context = useMemo(() => ({ close: () => setOpen(false) }), [setOpen]);

  return (
    <DialogContext value={context}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </Dialog.Root>
    </DialogContext>
  );
}
