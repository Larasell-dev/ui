import { createContext, useContext } from 'react';

type ButtonSize = 'md' | 'sm';

type ButtonGroupContextValue = {
  /** Undefined leaves each button at its default size. */
  size: ButtonSize | undefined;
  /** Disables every button in the group, on top of their own `disabled`. */
  disabled: boolean;
};

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(
  null,
);

/**
 * Whether a button is in a `<ButtonGroup>`, whether the group disables it, and
 * the size it renders at. Inside
 * a group the group owns the size, so a button that sets its own throws
 * instead of silently losing it.
 */
export function useButtonGroup(
  component: string,
  size: ButtonSize | null | undefined,
): {
  grouped: boolean;
  disabled: boolean;
  size: ButtonSize | null | undefined;
} {
  const group = useContext(ButtonGroupContext);
  if (!group) return { grouped: false, disabled: false, size };
  if (size !== undefined) {
    throw new Error(
      `<${component}> inside <ButtonGroup> takes its size from the group; remove its size prop.`,
    );
  }
  return { grouped: true, disabled: group.disabled, size: group.size };
}
