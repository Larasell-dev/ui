import { Menu } from '@base-ui/react/menu';
import { AnimatePresence } from 'motion/react';
import { useContext, type MouseEvent, type ReactNode } from 'react';
import { PopupMotion } from '../../utils/popup-motion.tsx';
import { MenuOpenContext } from './menu-context.ts';

// Menus often open from inside clickable rows, and React bubbles events
// through portals, so clicks in the menu would otherwise reach the row.
const stopPropagation = (event: MouseEvent) => event.stopPropagation();

type MenuPopupProps = {
  children?: ReactNode;
};

export function MenuPopup({ children }: MenuPopupProps) {
  const open = useContext(MenuOpenContext);

  return (
    <AnimatePresence>
      {open && (
        <Menu.Portal keepMounted>
          <Menu.Positioner
            sideOffset={4}
            align="end"
            className="outline-none"
            onClick={stopPropagation}
          >
            <Menu.Popup
              render={(props, state) => (
                <PopupMotion {...props} side={state.side} />
              )}
              className="border-border bg-elevated shadow-popover min-w-40 border bg-clip-padding outline-none"
            >
              {children}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      )}
    </AnimatePresence>
  );
}
