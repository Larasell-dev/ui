import { Combobox } from '@base-ui/react/combobox';
import SearchLine from '@iconify-icons/ri/search-line';
import { cn } from 'cn';
import { AnimatePresence } from 'motion/react';
import { Fragment, useRef, type CSSProperties, type ReactNode } from 'react';
import { useScrollMaskScrollbar } from '../../../utils/use-scroll-mask-scrollbar.ts';
import { PopupMotion } from '../../../utils/popup-motion.tsx';
import { Icon } from '../../icon/icon.tsx';
import { useSelect } from './select-context.ts';
import { SelectItem } from './select-item.tsx';
import { collisionPadding } from '../../../utils/collision-padding.ts';

type SelectPopupProps = {
  /** Where the list lines up with the button. */
  align?: 'start' | 'center' | 'end';
  /**
   * Renders each item, e.g. `{(c) => <Select.Item item={c}>…</Select.Item>}`.
   * Defaults to one `Select.Item` per item, showing its label.
   */
  // oxlint-disable-next-line typescript/no-explicit-any -- the items' type lives on Root
  children?: (item: any) => ReactNode;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/** The list the trigger opens, with the search field when there's a filter. */
export function SelectPopup({
  align = 'start',
  children = (item) => <SelectItem item={item} />,
  DANGEROUS_className,
  DANGEROUS_style,
}: SelectPopupProps) {
  const { open, filter } = useSelect();

  return (
    <AnimatePresence>
      {open && (
        <Combobox.Portal keepMounted>
          <Combobox.Positioner
            sideOffset={4}
            align={align}
            collisionPadding={collisionPadding()}
            className="z-50 outline-none data-anchor-hidden:invisible"
          >
            <Combobox.Popup
              render={(props, state) => (
                <PopupMotion {...props} side={state.side} />
              )}
              className={cn(
                'border-base-subtle bg-base-elevated shadow-popover flex max-h-[min(var(--available-height),20rem)] min-w-(--anchor-width) flex-col border bg-clip-padding outline-none data-[side=top]:flex-col-reverse',
                DANGEROUS_className,
              )}
              style={DANGEROUS_style}
            >
              {/* Above the button the column reverses, so the search sits at
                  the edge next to it and doesn't jump when the list flips. */}
              {/* Without a filter, a hidden read-only input still takes
                  focus, so the arrow keys and Enter work as with one. */}
              {!filter && <Combobox.Input readOnly className="sr-only" />}
              {filter && (
                <div
                  data-select-search=""
                  className="border-base-subtle text-base-tertiary flex shrink-0 items-center gap-2 border-b px-4 in-data-[side=top]:border-t in-data-[side=top]:border-b-0"
                >
                  <Icon icon={SearchLine} />
                  <Combobox.Input
                    placeholder={filter.placeholder}
                    className="type-label-md text-base-primary placeholder:text-base-tertiary h-9 w-full min-w-40 bg-transparent outline-none placeholder:select-none"
                  />
                </div>
              )}
              <Combobox.Empty className="text-base-tertiary flex gap-2 px-4 py-3 empty:hidden">
                {/* Lines the text up with the search's, after its icon. */}
                {filter && (
                  <span aria-hidden className="invisible flex">
                    <Icon icon={SearchLine} />
                  </span>
                )}
                <span className="type-label-md">
                  {filter?.empty ?? 'No matches'}
                </span>
              </Combobox.Empty>
              <SelectList>{children}</SelectList>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      )}
    </AnimatePresence>
  );
}

/** The scrolling list, fading at the edges it continues past. */
// oxlint-disable-next-line typescript/no-explicit-any -- the items' type lives on Root
function SelectList({ children }: { children: (item: any) => ReactNode }) {
  const { byKey } = useSelect();
  // Mounts with the popup, so the hook finds the list to measure.
  const list = useRef<HTMLDivElement>(null);
  useScrollMaskScrollbar(list);

  return (
    // Hidden when empty, so it adds no gap below the message.
    <Combobox.List
      ref={list}
      className="scroll-mask-y overflow-y-auto overscroll-contain empty:hidden data-empty:hidden"
    >
      {(key: string) => (
        <Fragment key={key}>{children(byKey.get(key))}</Fragment>
      )}
    </Combobox.List>
  );
}
