import { useFormContext } from '@inertiajs/react';
import {
  AlertDialogConfirm as BaseConfirm,
  type AlertDialogConfirmProps,
} from './alert-dialog-confirm.tsx';

/** Submits a surrounding Inertia `<Form>` and loads while it processes. */
export function AlertDialogConfirm({
  loading,
  type,
  ...props
}: AlertDialogConfirmProps) {
  const form = useFormContext();

  return (
    <BaseConfirm
      {...props}
      type={type ?? (form ? 'submit' : 'button')}
      loading={loading ?? form?.processing ?? false}
    />
  );
}
