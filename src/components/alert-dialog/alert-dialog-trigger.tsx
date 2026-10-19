import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { useRender } from '@base-ui/react/use-render';
import type { CSSProperties, ReactNode } from 'react';
import { withoutStyling } from '../../utils/without-styling.ts';

type AlertDialogTriggerProps = {
  children?: ReactNode;
  /**
   * The element to render, e.g. `render={<Button variant="secondary" />}`.
   * Without it, the trigger is a plain, unstyled `<button>`. Its `className`
   * and `style` are ignored; restyle a component through its own props.
   */
  render?: useRender.RenderProp;
  /** Set to `false` when `render` is not a `<button>`, e.g. a `<span>`. */
  nativeButton?: boolean;
  disabled?: boolean;
  /** Restyles the trigger. With `render={<Button />}`, use the button's own `DANGEROUS_` props instead. */
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/** Opens the alert dialog. Renders whatever element it is given. */
export function AlertDialogTrigger({
  children,
  render,
  nativeButton,
  disabled,
  DANGEROUS_className,
  DANGEROUS_style,
}: AlertDialogTriggerProps) {
  return (
    <AlertDialog.Trigger
      nativeButton={nativeButton}
      disabled={disabled}
      render={withoutStyling(render) as AlertDialog.Trigger.Props['render']}
      className={DANGEROUS_className}
      style={DANGEROUS_style}
    >
      {children}
    </AlertDialog.Trigger>
  );
}
