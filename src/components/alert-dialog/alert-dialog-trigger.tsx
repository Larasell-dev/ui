import { AlertDialog } from '@base-ui/react/alert-dialog';
import type { useRender } from '@base-ui/react/use-render';
import type { CSSProperties } from 'react';
import { withoutStyling } from '../../utils/without-styling.ts';

type AlertDialogTriggerProps = Omit<
  AlertDialog.Trigger.Props,
  'className' | 'style'
> & {
  /** Restyles the trigger. With `render={<Button />}`, use the button's own `DANGEROUS_` props instead. */
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * Opens the alert dialog. Takes the props of Base UI's trigger, e.g.
 * `render={<Button variant="secondary" />}`, except `className` and `style`.
 */
export function AlertDialogTrigger({
  render,
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: AlertDialogTriggerProps) {
  return (
    <AlertDialog.Trigger
      {...props}
      render={
        withoutStyling(
          render as useRender.RenderProp,
        ) as AlertDialog.Trigger.Props['render']
      }
      className={DANGEROUS_className}
      style={DANGEROUS_style}
    />
  );
}
