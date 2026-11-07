import { Combobox } from '@base-ui/react/combobox';
import SearchLine from '@iconify-icons/ri/search-line';
import { cn } from 'cn';
import { AnimatePresence } from 'motion/react';
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { PopupMotion } from '../../../utils/popup-motion.tsx';
import { Icon } from '../../icon/icon.tsx';
import { useCombobox } from './combobox-context.ts';
import { ComboboxItem } from './combobox-item.tsx';

type ComboboxPopupProps = {
  /** Where the list lines up with the button. */
  align?: 'start' | 'center' | 'end';
  /**
   * Renders each item, e.g. `{(c) => <Combobox.Item item={c}>…</Combobox.Item>}`.
   * Defaults to one `Combobox.Item` per item, showing its label.
   */
  // oxlint-disable-next-line typescript/no-explicit-any -- the items' type lives on Root
  children?: (item: any) => ReactNode;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/** The list the trigger opens, with the search field when there's a filter. */
export function ComboboxPopup({
  align = 'start',
  children = (item) => <ComboboxItem item={item} />,
  DANGEROUS_className,
  DANGEROUS_style,
}: ComboboxPopupProps) {
  const { open, filter, itemToKey } = useCombobox();

  return (
    <AnimatePresence>
      {open && (
        <Combobox.Portal keepMounted>
          <Combobox.Positioner
            sideOffset={4}
            align={align}
            className="z-50 outline-none"
          >
            <Combobox.Popup
              render={(props, state) => (
                <PopupMotion {...props} side={state.side} />
              )}
              className={cn(
                'border-base-subtle bg-base-elevated shadow-popover flex max-h-[min(var(--available-height),20rem)] min-w-(--anchor-width) flex-col border bg-clip-padding outline-none',
                DANGEROUS_className,
              )}
              style={DANGEROUS_style}
            >
              {/* Without a filter, a hidden read-only input still takes
                  focus, so the arrow keys and Enter work as with one. */}
              {!filter && <Combobox.Input readOnly className="sr-only" />}
              {filter && (
                <div className="border-base-subtle text-base-tertiary flex shrink-0 items-center gap-2 border-b px-4">
                  <Icon icon={SearchLine} />
                  <Combobox.Input
                    placeholder={filter.placeholder}
                    className="type-input-md text-base-primary placeholder:text-base-tertiary h-9 w-full min-w-40 bg-transparent outline-none placeholder:select-none"
                  />
                </div>
              )}
              <Combobox.Empty className="type-label-md text-base-tertiary px-4 py-3 text-center empty:hidden">
                {filter?.empty ?? 'No matches'}
              </Combobox.Empty>
              {/* Hidden when empty, so it adds no gap below the message. */}
              <Combobox.List className="overflow-y-auto overscroll-contain py-1 empty:hidden data-empty:hidden">
                {(item: unknown) => (
                  <Fragment key={itemToKey(item)}>{children(item)}</Fragment>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      )}
    </AnimatePresence>
  );
}
