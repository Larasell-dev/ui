import { Combobox } from '@base-ui/react/combobox';
import {
  FieldRootContext,
  useFieldRootContext,
} from '@base-ui/react/internals/field-root-context';
import CheckLine from '@iconify-icons/ri/check-line';
import CloseLine from '@iconify-icons/ri/close-line';
import { cn } from 'cn';
import { AnimatePresence } from 'motion/react';
import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { PopupMotion } from '../../../utils/popup-motion.tsx';
import { useScrollMaskScrollbar } from '../../../utils/use-scroll-mask-scrollbar.ts';
import { Icon } from '../../icon/icon.tsx';
import {
  TagComboboxItem,
  type TagComboboxItemProps,
} from './tag-combobox-item.tsx';

type TagComboboxProps = {
  /**
   * The options to pick from, e.g. `[{ value: 'de', label: 'German' }]`.
   * Takes the same props as `TagCombobox.Item`.
   */
  items?: TagComboboxItemProps[];
  /**
   * `TagCombobox.Item`s, for options that render more than their label.
   * They follow the `items`.
   */
  children?: ReactNode;
  /**
   * Submitted as `name[]`, one entry per picked item, in the items' order.
   * Inside a `Field`, the field's name is used.
   */
  name?: string;
  /** The picked items' values, to control them. */
  value?: string[];
  /** The values picked at first, when the combobox controls them itself. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Names the combobox when no `Field` label does. */
  'aria-label'?: string;
  /** Shown in the list when typing matches no item. */
  empty?: ReactNode;
  /** Names a tag's remove button, e.g. `(label) => \`Remove ${label}\``. */
  removeLabel?: (label: string) => string;
  /** Applied to the box around the tags and the input. */
  DANGEROUS_className?: string;
  /** Applied to the box around the tags and the input. */
  DANGEROUS_style?: CSSProperties;
};

type Option = TagComboboxItemProps & { label: string };

/**
 * Picks any number of items from a list, shown as tags in the box. Typing
 * filters the list, Enter adds the highlighted item, and the list stays open
 * to add more. Works like a checkbox group in a form: inside an Inertia
 * `<Form>` it submits, marks the form dirty, and resets with it, without
 * any state of yours.
 */
export function TagComboboxRoot({
  items = [],
  children,
  name: nameProp,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder,
  disabled,
  'aria-label': ariaLabel,
  empty = 'No matches',
  removeLabel = (label) => `Remove ${label}`,
  DANGEROUS_className,
  DANGEROUS_style,
}: TagComboboxProps) {
  const field = useFieldRootContext();
  const name = nameProp ?? field.name;
  const options = [...items.map(toOption), ...collectOptions(children)];
  const byValue = new Map(options.map((option) => [option.value, option]));

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = valueProp ?? uncontrolledValue;
  const initialValue = useRef(value);
  const [open, setOpen] = useState(false);
  const fieldset = useRef<HTMLSpanElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  useScrollMaskScrollbar(chips);
  // Set when the admin changes the value, so the form hears about it once
  // the checkboxes below show the new value.
  const changed = useRef(false);

  const change = (next: string[]) => {
    changed.current = true;
    if (valueProp === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  useEffect(() => {
    if (!changed.current) return;
    changed.current = false;
    // Inertia's <Form> compares its data on input events to know it's dirty.
    fieldset.current?.dispatchEvent(new Event('input', { bubbles: true }));
  }, [value]);

  // Ticks the checkboxes when the value changes, but not on every render: a
  // form reset ticks them itself, and the form re-renders before they're read
  // back, which would tick the old ones again if React controlled them.
  const optionValues = options.map((option) => option.value).join('\n');
  useLayoutEffect(() => {
    for (const input of fieldset.current?.querySelectorAll('input') ?? []) {
      input.checked = value.includes(input.value);
    }
  }, [value, optionValues]);

  useEffect(() => {
    const form = fieldset.current?.closest('form');
    if (!form) return;
    // A form reset ticks the checkboxes it had at first; read them back. Inertia
    // has ticked them when it sends the event, but a native reset only after
    // its listeners and their microtasks ran, so read them in the next task.
    const reset = () =>
      setTimeout(() => {
        const checked = Array.from(
          fieldset.current?.querySelectorAll('input') ?? [],
        )
          .filter((input) => input.checked)
          .map((input) => input.value);
        if (valueProp === undefined) setUncontrolledValue(checked);
        onValueChange?.(checked);
      }, 0);
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [valueProp, onValueChange]);

  return (
    <>
      {/* Without the field's name, so Combobox doesn't submit the values too,
          as `name` without the brackets. */}
      <FieldRootContext value={{ ...field, name: undefined }}>
        <Combobox.Root
          multiple
          items={options.map((option) => option.value)}
          itemToStringLabel={(item: string) => byValue.get(item)?.label ?? item}
          value={value}
          onValueChange={(next, details) => {
            // Base UI clears every pick on Escape while the list is closed;
            // one key shouldn't undo hundreds of picks.
            if (details.reason === 'escape-key') {
              details.cancel();
              return;
            }
            change(next);
          }}
          open={open}
          onOpenChange={(next, details) => {
            // Picking an item keeps the list open, to pick more.
            if (!next && details.reason === 'item-press') {
              details.cancel();
              return;
            }
            setOpen(next);
          }}
          autoHighlight
          disabled={disabled}
        >
          <Combobox.InputGroup
            data-tag-combobox=""
            className={cn(
              'border-base-strong bg-base-surface text-base-primary flex w-full border',
              'has-[[data-tag-input]:focus]:focus-ring',
              'has-[[data-tag-input][data-invalid]]:border-intent-negative has-[[data-tag-input][data-invalid]]:focus-ring-negative',
              'has-[[data-tag-input]:disabled]:cursor-not-allowed has-[[data-tag-input]:disabled]:opacity-50',
              DANGEROUS_className,
            )}
            style={DANGEROUS_style}
          >
            {/* Many tags scroll in here rather than pushing the list off screen, and
                fade at the edge they continue past. Not the box itself: the
                fade is a mask, which would hide the box's focus ring too. */}
            <Combobox.Chips
              ref={chips}
              className="scroll-mask-y flex max-h-40 w-full flex-wrap items-center gap-1.5 overflow-y-auto overscroll-contain px-2 py-1.5"
            >
              {value.map((picked) => {
                const option = byValue.get(picked);
                const label = option?.label ?? picked;

                return (
                  <Combobox.Chip
                    key={picked}
                    aria-label={label}
                    className={cn(
                      'type-label-sm bg-base-muted relative isolate flex max-w-full min-w-0 items-center gap-1 py-0.5 pr-0.5 pl-2 outline-none',
                      // The highlight is a layer over the tag's own color.
                      'focus-visible:focus-ring data-highlighted:before:bg-state-hover before:absolute before:inset-0 before:-z-10',
                    )}
                  >
                    <span className="min-w-0 truncate">
                      {option?.children ?? label}
                    </span>
                    <Combobox.ChipRemove
                      aria-label={removeLabel(label)}
                      className={cn(
                        'text-base-secondary flex size-5 shrink-0 cursor-pointer items-center justify-center outline-none',
                        'focus-visible:focus-ring hover:bg-state-hover hover:text-base-primary',
                      )}
                    >
                      <Icon icon={CloseLine} />
                    </Combobox.ChipRemove>
                  </Combobox.Chip>
                );
              })}
              <Combobox.Input
                data-tag-input=""
                aria-label={ariaLabel}
                placeholder={value.length === 0 ? placeholder : undefined}
                className={cn(
                  'type-input-md min-w-24 flex-1 bg-transparent px-1.5 py-1 outline-none',
                  'placeholder:text-base-tertiary placeholder:select-none',
                  'disabled:cursor-not-allowed',
                )}
              />
            </Combobox.Chips>
          </Combobox.InputGroup>

          <AnimatePresence>
            {open && (
              <Combobox.Portal keepMounted>
                <Combobox.Positioner
                  sideOffset={4}
                  align="start"
                  className="z-50 w-(--anchor-width) outline-none"
                >
                  <Combobox.Popup
                    render={(props, state) => (
                      <PopupMotion {...props} side={state.side} />
                    )}
                    className="border-base-subtle bg-base-elevated shadow-popover max-h-[min(var(--available-height),20rem)] overflow-y-auto overscroll-contain border bg-clip-padding outline-none"
                  >
                    <Combobox.Empty className="type-label-md text-base-tertiary flex items-center px-4 py-1.5 empty:hidden">
                      {empty}
                    </Combobox.Empty>
                    <Combobox.List>
                      {(item: string) => {
                        const option = byValue.get(item)!;

                        return (
                          <Combobox.Item
                            key={item}
                            value={item}
                            // Named by the label, which is what typing matches,
                            // rather than by the rendered children.
                            aria-label={option.label}
                            disabled={option.disabled}
                            className={cn(
                              'type-label-md text-base-primary flex w-full cursor-pointer items-center gap-2 px-4 py-1.5 outline-none select-none',
                              'not-data-disabled:data-highlighted:bg-action-neutral-ghost-hover data-disabled:cursor-not-allowed data-disabled:opacity-50',
                              option.DANGEROUS_className,
                            )}
                            style={option.DANGEROUS_style}
                          >
                            <span className="min-w-0 flex-1 wrap-break-word">
                              {option.children ?? option.label}
                            </span>
                            <Combobox.ItemIndicator className="flex shrink-0">
                              <Icon icon={CheckLine} />
                            </Combobox.ItemIndicator>
                          </Combobox.Item>
                        );
                      }}
                    </Combobox.List>
                  </Combobox.Popup>
                </Combobox.Positioner>
              </Combobox.Portal>
            )}
          </AnimatePresence>
        </Combobox.Root>
      </FieldRootContext>

      {/* What the form submits and resets: a checkbox per item, like a
          checkbox group, since a form reset restores checkboxes by value. */}
      <span ref={fieldset} hidden>
        {name &&
          options.map((option) => (
            <input
              key={option.value}
              type="checkbox"
              name={name.endsWith('[]') ? name : `${name}[]`}
              value={option.value}
              // What a native form reset goes back to: the first value.
              defaultChecked={initialValue.current.includes(option.value)}
              disabled={disabled}
              tabIndex={-1}
              aria-hidden
            />
          ))}
      </span>
    </>
  );
}

/** The props of the `TagCombobox.Item`s among the children, in order. */
function collectOptions(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap((child): Option[] => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [];
    if (child.type === Fragment) return collectOptions(child.props.children);
    if (child.type !== TagComboboxItem) return [];

    return [toOption(child.props as TagComboboxItemProps)];
  });
}

function toOption(props: TagComboboxItemProps): Option {
  const label =
    props.label ??
    (typeof props.children === 'string' ? props.children : props.value);

  return { ...props, label };
}
