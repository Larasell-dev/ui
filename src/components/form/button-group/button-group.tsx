import { RovingFocusGroup } from '@roving-focus/react';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
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

const navigationKeys = new Set(['ArrowLeft', 'ArrowRight', 'Home', 'End']);

/**
 * Base UI prevents every key but Tab on a disabled button that stays
 * focusable, such as a loading one, and the roving focus skips prevented keys,
 * so focus would be stuck on it. Runs before the roving focus handles the key
 * and lets it see its own keys. Their default stays prevented.
 */
function allowNavigationFromDisabled(event: KeyboardEvent) {
  if (!navigationKeys.has(event.key)) return;
  if (!(event.target instanceof Element)) return;
  if (event.target.getAttribute('aria-disabled') !== 'true') return;
  (event as { defaultPrevented: boolean }).defaultPrevented = false;
}

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
        onKeyDown={allowNavigationFromDisabled}
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
