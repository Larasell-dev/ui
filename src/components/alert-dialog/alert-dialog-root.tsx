import { AlertDialog } from '@base-ui/react/alert-dialog';

type AlertDialogRootProps = Pick<
  AlertDialog.Root.Props,
  'open' | 'defaultOpen' | 'onOpenChange' | 'children'
>;

/**
 * Asks the user to confirm something before it happens. Unlike a dialog, it
 * does not close when clicking outside, so the user has to make a choice.
 */
export function AlertDialogRoot(props: AlertDialogRootProps) {
  return <AlertDialog.Root {...props} />;
}
