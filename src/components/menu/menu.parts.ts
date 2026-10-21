import { Menu as BaseMenu } from '@base-ui/react/menu';

export { MenuRoot as Root } from './menu-root.tsx';
export { MenuPopup as Popup } from './menu-popup.tsx';
export { MenuItem as Item } from './menu-item.tsx';

/**
 * Opens the menu. Base UI's trigger, forwarded as is: unstyled, so style it
 * yourself with `className`, or swap it with `render={<Button />}`.
 */
export const Trigger = BaseMenu.Trigger;
