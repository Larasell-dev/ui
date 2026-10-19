import { AlertDialog } from '@base-ui/react/alert-dialog';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertDialogContext } from './alert-dialog-context.ts';

type AlertDialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

/**
 * Asks the user to confirm something before it happens. Unlike a dialog, it
 * does not close when clicking outside, so the user has to make a choice.
 * While an action is processing, it cannot be closed at all.
 */
export function AlertDialogRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: AlertDialogRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const [processingCount, setProcessingCount] = useState(0);
  // Read in event handlers, which may run before a re-render.
  const processingRef = useRef(0);

  const setOpen = useCallback(
    (next: boolean) => {
      setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  // Escape and cancel cannot close the dialog while an action is processing,
  // so the user does not mistake closing it for aborting the action.
  const dismiss = useCallback(
    (next: boolean) => {
      if (!next && processingRef.current > 0) return;
      setOpen(next);
    },
    [setOpen],
  );

  const startProcessing = useCallback(() => {
    processingRef.current += 1;
    setProcessingCount((count) => count + 1);
    return () => {
      processingRef.current -= 1;
      setProcessingCount((count) => count - 1);
    };
  }, []);

  const context = useMemo(
    () => ({
      // An explicit close always works, e.g. from a request's onSuccess,
      // which runs before the request stops processing.
      close: () => setOpen(false),
      processing: processingCount > 0,
      startProcessing,
    }),
    [setOpen, processingCount, startProcessing],
  );

  return (
    <AlertDialogContext value={context}>
      <AlertDialog.Root open={open} onOpenChange={dismiss}>
        {children}
      </AlertDialog.Root>
    </AlertDialogContext>
  );
}
