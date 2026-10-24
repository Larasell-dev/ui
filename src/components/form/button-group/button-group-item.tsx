import { RovingFocusItem } from '@roving-focus/react';
import { cloneElement, type ReactElement } from 'react';

type ButtonGroupItemProps = {
  grouped: boolean;
  /** Whether the arrow keys can reach the button. */
  focusable: boolean;
  /** Whether the button is disabled, e.g. while loading. */
  disabled: boolean;
  children: ReactElement;
};

/**
 * Makes a button in a `<ButtonGroup>` one stop of the group's roving focus,
 * without a wrapper element. Outside a group, renders the button as is.
 */
export function ButtonGroupItem({
  grouped,
  focusable,
  disabled,
  children,
}: ButtonGroupItemProps) {
  if (!grouped) return children;
  return (
    <RovingFocusItem asChild focusable={focusable}>
      {/* The roving item clears `data-disabled` on any focusable item, which
          would drop the disabled styles of a loading button. Set on the button
          itself, it wins over the item's. Remove once @roving-focus/react
          keeps a `data-disabled` set on the child; best-before: 2026-12-05 */}
      {cloneElement(children as ReactElement<Record<string, unknown>>, {
        'data-disabled': disabled ? '' : undefined,
      })}
    </RovingFocusItem>
  );
}
