/**
 * Components that work with Inertia's `<Form>`. Importing this entry needs
 * `@inertiajs/react`, an optional peer dependency of this package.
 */
import * as Parts from './components/alert-dialog/alert-dialog.parts.ts';
import { AlertDialogConfirm } from './components/alert-dialog/alert-dialog-inertia-confirm.tsx';

/**
 * The same AlertDialog, except that inside an Inertia `<Form>` the confirm
 * button submits it and stays loading, locking the dialog, while it processes.
 */
export const AlertDialog = { ...Parts, Confirm: AlertDialogConfirm };
