import { Select } from '@base-ui/react/select';
import ArrowDownSLine from '@iconify-icons/ri/arrow-down-s-line';
import CheckLine from '@iconify-icons/ri/check-line';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { cn } from 'cn';
import { Icon } from '../icon/icon.tsx';
import { PopupMotion } from '../../utils/popup-motion.tsx';

type PageSizeSelectProps = {
  value: number;
  options: ReadonlyArray<number>;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  'aria-label'?: string;
};

export function PageSizeSelect({
  value,
  options,
  onValueChange,
  disabled,
  'aria-label': ariaLabel = 'Rows per page',
}: PageSizeSelectProps) {
  const [open, setOpen] = useState(false);

  // Base UI's trigger can't stay focusable while `disabled`, so a disabled
  // select is made read-only and kept closed instead. It keeps focus, like the
  // pagination buttons, but can't be opened or changed.
  return (
    <Select.Root
      value={value}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
      items={options.map((option) => ({ value: option, label: option }))}
      readOnly={disabled}
      open={open && !disabled}
      onOpenChange={(next) => setOpen(next && !disabled)}
    >
      <Select.Trigger
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          'type-label-md border-border inline-flex min-w-18 cursor-pointer items-center justify-between gap-2 border bg-white py-1.5 pr-2 pl-3 text-mauve-950 tabular-nums select-none',
          'focus-visible:focus-ring not-data-disabled:hover:bg-mauve-100',
          // Only disabled while a page loads.
          'data-disabled:cursor-wait data-disabled:opacity-50',
          'dark:bg-mauve-900 dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800',
        )}
      >
        <Select.Value />
        <Select.Icon className="flex text-mauve-500">
          <Icon icon={ArrowDownSLine} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <AnimatePresence>
          {open && !disabled && (
            <Select.Positioner
              alignItemWithTrigger={false}
              sideOffset={4}
              className="z-50 outline-none"
            >
              <Select.Popup
                render={(props, state) => (
                  <PopupMotion {...props} side={state.side} />
                )}
                className={cn(
                  'border-border min-w-(--anchor-width) border bg-white bg-clip-padding shadow-md',
                  'dark:bg-mauve-900',
                )}
              >
                {options.map((option) => (
                  <Select.Item
                    key={option}
                    value={option}
                    className={cn(
                      'type-label-md grid cursor-pointer grid-cols-[1rem_1fr] items-center gap-2 py-1.5 pr-4 pl-2 text-mauve-950 tabular-nums outline-none select-none',
                      'data-highlighted:bg-mauve-100',
                      'dark:text-mauve-100 dark:data-highlighted:bg-mauve-800',
                    )}
                  >
                    <Select.ItemIndicator className="col-start-1 flex">
                      <Icon icon={CheckLine} />
                    </Select.ItemIndicator>
                    <Select.ItemText className="col-start-2">
                      {option}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          )}
        </AnimatePresence>
      </Select.Portal>
    </Select.Root>
  );
}
