import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../form/button/button.tsx';

type AlertDialogTriggerProps = {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/** A button that opens the alert dialog. */
export function AlertDialogTrigger({
  children,
  variant,
  disabled,
  DANGEROUS_className,
  DANGEROUS_style,
}: AlertDialogTriggerProps) {
  return (
    <AlertDialog.Trigger
      disabled={disabled}
      render={
        <Button
          variant={variant}
          disabled={disabled}
          DANGEROUS_className={DANGEROUS_className}
          DANGEROUS_style={DANGEROUS_style}
        />
      }
    >
      {children}
    </AlertDialog.Trigger>
  );
}
