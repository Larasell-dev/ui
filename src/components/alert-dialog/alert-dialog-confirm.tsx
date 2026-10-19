import { useEffect, type MouseEvent, type ReactNode } from 'react';
import { Button } from '../form/button/button.tsx';
import { useAlertDialog } from './alert-dialog-context.ts';

export type AlertDialogConfirmProps = {
  children?: ReactNode;
  /** Defaults to `primary`; use `destructive` for actions that destroy data. */
  variant?: 'primary' | 'destructive';
  /** Shows a spinner and locks the dialog open, e.g. while a request runs. */
  loading?: boolean;
  /** E.g. until the user typed a confirmation text. */
  disabled?: boolean;
  /** Use `submit` inside a form. Defaults to `button`. */
  type?: 'button' | 'submit';
  /** Does not close the dialog by itself; call `close`, e.g. once a request succeeds. */
  onClick?: (
    event: MouseEvent<HTMLButtonElement>,
    dialog: { close: () => void },
  ) => void;
};

/** Carries out the action. Unlike cancel, it does not close the dialog by itself. */
export function AlertDialogConfirm({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  type = 'button',
  onClick,
}: AlertDialogConfirmProps) {
  const { close, startProcessing } = useAlertDialog();

  useEffect(() => {
    if (loading) return startProcessing();
  }, [loading, startProcessing]);

  return (
    <Button
      type={type}
      variant={variant}
      {...(loading ? { loading: true } : { disabled })}
      onClick={(event) => onClick?.(event, { close })}
    >
      {children}
    </Button>
  );
}
