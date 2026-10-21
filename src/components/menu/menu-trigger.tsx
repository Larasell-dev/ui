import { Menu } from '@base-ui/react/menu';

type MenuTriggerProps = Menu.Trigger.Props;

/**
 * Opens the menu. Unstyled, so style it yourself: it takes all of Base UI's
 * trigger props, e.g. `className`, `tabIndex` or `render={<Button />}`.
 */
export function MenuTrigger(props: MenuTriggerProps) {
  return <Menu.Trigger {...props} />;
}
