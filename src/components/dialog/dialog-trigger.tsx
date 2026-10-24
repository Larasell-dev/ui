import { Dialog } from '@base-ui/react/dialog';
import type { useRender } from '@base-ui/react/use-render';
import type { CSSProperties } from 'react';
import { withoutStyling } from '../../utils/without-styling.ts';

type DialogTriggerProps = Omit<Dialog.Trigger.Props, 'className' | 'style'> & {
  /** Restyles the trigger. With `render={<Button />}`, use the button's own `DANGEROUS_` props instead. */
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * Opens the dialog. Takes the props of Base UI's trigger, e.g.
 * `render={<Button variant="secondary" />}`, except `className` and `style`.
 */
export function DialogTrigger({
  render,
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: DialogTriggerProps) {
  return (
    <Dialog.Trigger
      {...props}
      render={
        withoutStyling(
          render as useRender.RenderProp,
        ) as Dialog.Trigger.Props['render']
      }
      className={DANGEROUS_className}
      style={DANGEROUS_style}
    />
  );
}
