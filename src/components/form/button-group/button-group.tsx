import { RovingFocusGroup } from '@roving-focus/react';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from 'cn';
import { ButtonGroupContext } from './button-group-context.ts';

type ButtonGroupProps = {
  /** Names the group for assistive tech. */
  label: string;
  /** The size of every button in the group, which may not set its own. */
  size?: 'md' | 'sm';
  /** Disables every button in the group. */
  disabled?: boolean;
  /** `Button`s and `IconButton`s, also as a `Menu.Trigger`. */
  children: ReactNode;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * Joins buttons into one row that shares borders and a size. The group is a
 * single tab stop: the arrow keys, Home and End move between its buttons,
 * skipping disabled ones.
 */
export function ButtonGroup({
  label,
  size,
  disabled = false,
  children,
  DANGEROUS_className,
  DANGEROUS_style,
}: ButtonGroupProps) {
  return (
    <ButtonGroupContext value={{ size, disabled }}>
      <RovingFocusGroup
        orientation="horizontal"
        role="group"
        aria-label={label}
        className={cn(
          // Neighbours overlap by their 1px border, so the two read as one line.
          // Each is positioned, so the later one paints its border on top, and the
          // hovered or focused one comes to the front to show all of its own.
          // A sibling selector rather than :first-child, as an open menu inserts
          // hidden focus guards next to its trigger.
          'inline-flex *:relative *:hover:z-10 *:focus-visible:z-10 [&>button~button]:-ml-px',
          DANGEROUS_className,
        )}
        style={DANGEROUS_style}
      >
        {children}
      </RovingFocusGroup>
    </ButtonGroupContext>
  );
}
