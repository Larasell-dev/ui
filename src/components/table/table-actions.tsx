import More2Fill from '@iconify-icons/ri/more-2-fill';
import type { CSSProperties, MouseEvent } from 'react';
import { cn } from 'cn';
import { Icon } from '../icon/icon.tsx';
import { MenuTrigger } from '../menu/menu-trigger.tsx';

// The trigger sits inside the row, so its clicks would otherwise reach a
// clickable row.
const stopPropagation = (event: MouseEvent) => event.stopPropagation();

type TableActionsTriggerProps = {
  /** Name the row, e.g. "Actions for #1001"; the button has only an icon. */
  'aria-label': string;
  disabled?: boolean;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * The row's icon button that opens its `<Table.Actions>` menu. The menu's
 * other parts are the shared `Menu` parts under table names.
 */
export function TableActionsTrigger({
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: TableActionsTriggerProps) {
  return (
    <MenuTrigger
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
    </MenuTrigger>
  );
}
