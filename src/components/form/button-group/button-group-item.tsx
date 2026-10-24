import { RovingFocusItem } from '@roving-focus/react';
import type { ReactElement } from 'react';

type ButtonGroupItemProps = {
  grouped: boolean;
  /**
   * A disabled or loading button is skipped by the arrow keys. This also keeps
   * the roving item from clearing Base UI's `data-disabled`, which the
   * disabled styles rely on.
   */
  disabled: boolean;
  children: ReactElement;
};

/**
 * Makes a button in a `<ButtonGroup>` one stop of the group's roving focus,
 * without a wrapper element. Outside a group, renders the button as is.
 */
export function ButtonGroupItem({
  grouped,
  disabled,
  children,
}: ButtonGroupItemProps) {
  if (!grouped) return children;
  return (
    <RovingFocusItem asChild focusable={!disabled}>
      {children}
    </RovingFocusItem>
  );
}
