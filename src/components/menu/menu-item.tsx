import { Menu } from '@base-ui/react/menu';
import type { useRender } from '@base-ui/react/use-render';
import type { IconifyIcon } from '@iconify/types';
import { cva, type VariantProps } from 'class-variance-authority';
import type { MouseEventHandler, ReactNode } from 'react';
import { Icon } from '../icon/icon.tsx';
import { withoutStyling } from '../../utils/without-styling.ts';

const itemVariants = cva(
  [
    'type-label-md flex w-full cursor-pointer items-center gap-2 px-4 py-1.5 no-underline outline-none select-none',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-mauve-950 not-data-disabled:data-highlighted:bg-mauve-100',
          'dark:text-mauve-100 dark:not-data-disabled:data-highlighted:bg-mauve-800',
        ],
        destructive: [
          'text-red-600 not-data-disabled:data-highlighted:bg-red-100',
          'dark:text-red-400 dark:not-data-disabled:data-highlighted:bg-red-950',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type MenuItemProps = VariantProps<typeof itemVariants> & {
  children?: ReactNode;
  /** Shown before the label, e.g. `icon={DeleteBinLine}`. */
  icon?: IconifyIcon;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  /**
   * Renders the item as another element, e.g. `render={<a href="/orders/1001/edit" />}`
   * or a router link. Its `className` and `style` are ignored.
   */
  render?: useRender.RenderProp;
};

export function MenuItem({
  variant,
  icon,
  children,
  render,
  ...props
}: MenuItemProps) {
  return (
    <Menu.Item
      {...props}
      render={withoutStyling(render) as Menu.Item.Props['render']}
      className={itemVariants({ variant })}
    >
      {icon && <Icon icon={icon} />}
      {children}
    </Menu.Item>
  );
}
