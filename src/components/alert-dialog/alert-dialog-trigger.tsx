import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { useRender } from '@base-ui/react/use-render';
import type { ReactNode } from 'react';

type AlertDialogTriggerProps = {
  children?: ReactNode;
  /**
   * The element to render, e.g. `render={<Button variant="secondary" />}`.
   * Without it, the trigger is a plain, unstyled `<button>`.
   */
  render?: useRender.RenderProp;
  /** Set to `false` when `render` is not a `<button>`, e.g. a `<span>`. */
  nativeButton?: boolean;
  disabled?: boolean;
};

/** Opens the alert dialog. Renders whatever element it is given. */
export function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  return (
    <AlertDialog.Trigger
      {...props}
      render={props.render as AlertDialog.Trigger.Props['render']}
    />
  );
}
