import { Menu } from '@base-ui/react/menu';
import { useState } from 'react';
import { MenuOpenContext } from './menu-context.ts';

type MenuRootProps = Pick<
  Menu.Root.Props,
  'open' | 'defaultOpen' | 'onOpenChange' | 'children'
>;

/** A menu of actions: a `<Menu.Trigger>` and the `<Menu.Popup>` it opens. */
export function MenuRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: MenuRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  return (
    <MenuOpenContext value={open}>
      <Menu.Root
        {...props}
        open={open}
        onOpenChange={(next, details) => {
          setUncontrolledOpen(next);
          onOpenChange?.(next, details);
        }}
      />
    </MenuOpenContext>
  );
}
