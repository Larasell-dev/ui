import { Menu } from '@base-ui/react/menu';
import type { useRender } from '@base-ui/react/use-render';
import More2Fill from '@iconify-icons/ri/more-2-fill';
import type {
  CSSProperties,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
} from 'react';
import type { IconifyIcon } from '@iconify/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Icon } from '../icon/icon.tsx';
import { withoutStyling } from '../../utils/without-styling.ts';

// Menus open from inside rows, and React bubbles events through portals, so
// clicks in the menu would otherwise reach a clickable row.
const stopPropagation = (event: MouseEvent) => event.stopPropagation();

type TableActionsProps = Pick<
  Menu.Root.Props,
  'open' | 'defaultOpen' | 'onOpenChange' | 'children'
>;

/** A row's menu of actions. Put it in its own cell, usually the last. */
export function TableActions(props: TableActionsProps) {
  return <Menu.Root {...props} />;
}

type TableActionsTriggerProps = {
  /** Name the row, e.g. "Actions for #1001"; the button has only an icon. */
  'aria-label': string;
  disabled?: boolean;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

export function TableActionsTrigger({
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: TableActionsTriggerProps) {
  return (
    <Menu.Trigger
      {...props}
      onClick={stopPropagation}
      className={cn(
        // `relative z-10` keeps it above a <Table.Link> stretched over the row;
        // the negative margin keeps it from making the row taller.
        'relative z-10 -my-2 inline-flex size-9 cursor-pointer items-center justify-center border border-transparent bg-transparent align-middle text-mauve-950 select-none',
        'focus-visible:focus-ring not-data-disabled:hover:bg-mauve-100 data-popup-open:bg-mauve-100',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800 dark:data-popup-open:bg-mauve-800',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      <Icon icon={More2Fill} />
    </Menu.Trigger>
  );
}

type TableActionsPopupProps = {
  children?: ReactNode;
};

export function TableActionsPopup({ children }: TableActionsPopupProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        sideOffset={4}
        align="end"
        className="z-50 outline-none"
        onClick={stopPropagation}
      >
        <Menu.Popup
          className={cn(
            'min-w-40 border border-mauve-200 bg-white shadow-md outline-none',
            'dark:border-mauve-700 dark:bg-mauve-900',
          )}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

const itemVariants = cva(
  [
    'type-label-md flex w-full cursor-pointer items-center gap-2 px-4 py-1.5 no-underline outline-none select-none',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-mauve-950 data-highlighted:bg-mauve-100',
          'dark:text-mauve-100 dark:data-highlighted:bg-mauve-800',
        ],
        destructive: [
          'text-red-600 data-highlighted:bg-red-100',
          'dark:text-red-400 dark:data-highlighted:bg-red-950',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type TableActionsItemProps = VariantProps<typeof itemVariants> & {
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

export function TableActionsItem({
  variant,
  icon,
  children,
  render,
  ...props
}: TableActionsItemProps) {
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
