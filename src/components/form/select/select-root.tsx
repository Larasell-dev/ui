import { Combobox } from '@base-ui/react/combobox';
import {
  FieldRootContext,
  useFieldRootContext,
} from '@base-ui/react/internals/field-root-context';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { SelectContext, type SelectFilter } from './select-context.ts';

type ValueOf<Multiple> = Multiple extends true ? string[] : string | null;

export type SelectRootProps<Item, Multiple extends boolean | undefined> = {
  /**
   * Picks several items: the value is an array, and picking an item toggles
   * it and keeps the list open. Without it, picking an item closes the list.
   */
  multiple?: Multiple;
  items: readonly Item[];
  /** The item's key, which the value holds and the form submits. */
  itemToKey: (item: Item) => string;
  /** What the search matches, screen readers read and items show by default. */
  itemToLabel: (item: Item) => string;
  /** The picked items' keys. Keys of no item are left out. */
  value?: ValueOf<Multiple>;
  defaultValue?: ValueOf<Multiple>;
  onValueChange?: (value: ValueOf<Multiple>) => void;
  /**
   * Submits the picked keys under this name, as `name[]` with `multiple`.
   * Inside a `Field`, the field's name is used. Without one, the select is no
   * form field, e.g. for a switcher in a toolbar.
   */
  name?: string;
  /** Adds a search field at the top of the list. Omit it for none. */
  filter?: SelectFilter;
  disabled?: boolean;
  /**
   * Shows the value but keeps it from changing. Unlike `disabled`, the select
   * stays focusable, so screen readers read the value, and it's submitted.
   */
  readOnly?: boolean;
  /** A `Select.Input` or `Select.Trigger` and the `Select.Popup` it opens. */
  children?: ReactNode;
};

/**
 * Picks one item, or several with `multiple`, from a list that opens from a
 * button and can be searched. With a name it works like a field in a form: it
 * submits, marks an Inertia `<Form>` dirty, and resets with it.
 */
export function SelectRoot<Item, Multiple extends boolean | undefined = false>({
  multiple,
  items,
  itemToKey,
  itemToLabel,
  value: valueProp,
  defaultValue,
  onValueChange,
  name: nameProp,
  filter,
  disabled,
  readOnly,
  children,
}: SelectRootProps<Item, Multiple>) {
  const field = useFieldRootContext();
  const name = nameProp ?? field.name;
  const byKey = new Map(items.map((item) => [itemToKey(item), item]));
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? ((multiple ? [] : null) as ValueOf<Multiple>),
  );
  const value = valueProp === undefined ? uncontrolledValue : valueProp;
  const keyList = (
    Array.isArray(value) ? value : value == null ? [] : [value]
  ).filter((key) => byKey.has(key));
  // As text, so the keys stay the same array while they're equal. JSON keeps
  // an empty key, such as a "none" item's, apart from no key at all.
  const keyText = JSON.stringify(keyList);
  // The same array while the keys stay the same: Base UI takes a new one for a
  // changed value and updates the surrounding Field, which would render again.
  const keys = useMemo(() => JSON.parse(keyText) as string[], [keyText]);
  const selected = items.filter((item) => keys.includes(itemToKey(item)));

  // A form reset ticks the checkboxes picked at first, so they keep those as
  // their default rather than following the value.
  const initialKeys = useRef(keys);
  const inputs = useRef<HTMLSpanElement>(null);
  // Set when the admin changes the value, so the form hears about it once
  // the checkboxes below show the new value.
  const changed = useRef(false);

  const change = (next: string[]) => {
    const typed = (multiple ? next : (next[0] ?? null)) as ValueOf<Multiple>;
    changed.current = true;
    if (valueProp === undefined) setUncontrolledValue(typed);
    onValueChange?.(typed);
  };

  useEffect(() => {
    if (!changed.current) return;
    changed.current = false;
    // Inertia's <Form> compares its data on input events to know it's dirty.
    inputs.current?.dispatchEvent(new Event('input', { bubbles: true }));
  }, [value]);

  // Ticks the checkboxes when the value changes, but not on every render: a
  // form reset ticks them itself, and the form re-renders before they're read
  // back, which would tick the old ones again if React controlled them.
  useLayoutEffect(() => {
    for (const input of inputs.current?.querySelectorAll('input') ?? []) {
      input.checked = keys.includes(input.value);
    }
  }, [keys, name]);

  useEffect(() => {
    const form = inputs.current?.closest('form');
    if (!form) return;
    // A form reset ticks the checkboxes it had at first; read them back. Inertia
    // has ticked them when it sends the event, but a native reset only after
    // its listeners and their microtasks ran, so read them in the next task.
    const reset = () =>
      setTimeout(() => {
        const checked = Array.from(
          inputs.current?.querySelectorAll('input') ?? [],
        )
          .filter((input) => input.checked)
          .map((input) => input.value);
        const typed = (
          multiple ? checked : (checked[0] ?? null)
        ) as ValueOf<Multiple>;
        if (valueProp === undefined) setUncontrolledValue(typed);
        onValueChange?.(typed);
      }, 0);
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [multiple, valueProp, onValueChange]);

  return (
    <SelectContext
      value={{
        open,
        multiple: !!multiple,
        selected,
        byKey,
        itemToKey: itemToKey as (item: unknown) => string,
        itemToLabel: itemToLabel as (item: unknown) => string,
        filter,
      }}
    >
      {/* Without the field's name, so Combobox doesn't submit the keys too;
          the checkboxes below do. */}
      <FieldRootContext value={{ ...field, name: undefined }}>
        <Combobox.Root<string, boolean>
          multiple={!!multiple}
          items={items.map(itemToKey)}
          itemToStringLabel={(key: string) =>
            byKey.has(key) ? itemToLabel(byKey.get(key)!) : key
          }
          value={(multiple ? keys : (keys[0] ?? null)) as string}
          onValueChange={(next, details) => {
            // Base UI clears the value on Escape while the list is closed;
            // one key shouldn't undo hundreds of picks.
            if (details.reason === 'escape-key') {
              details.cancel();
              return;
            }
            change(
              Array.isArray(next) ? next : next == null ? [] : [next as string],
            );
          }}
          onInputValueChange={(_query, details) => {
            // Several items: picking one keeps the search, to pick more of
            // what it found.
            if (
              multiple &&
              details.reason === 'input-clear' &&
              (details as { isItemPress?: boolean }).isItemPress
            ) {
              details.cancel();
            }
          }}
          open={open}
          onOpenChange={(next, details) => {
            // Read-only shows the value only; its list stays closed.
            if (readOnly && next) {
              details.cancel();
              return;
            }
            // Several items: picking one keeps the list open, to pick more.
            if (multiple && !next && details.reason === 'item-press') {
              details.cancel();
              return;
            }
            setOpen(next);
          }}
          autoHighlight
          disabled={disabled}
          readOnly={readOnly}
        >
          {children}
        </Combobox.Root>
      </FieldRootContext>
      {name && (
        <span ref={inputs} hidden>
          {items.map((item) => (
            <input
              key={itemToKey(item)}
              type="checkbox"
              name={multiple ? `${name}[]` : name}
              value={itemToKey(item)}
              defaultChecked={initialKeys.current.includes(itemToKey(item))}
              disabled={disabled}
              tabIndex={-1}
              aria-hidden
            />
          ))}
        </span>
      )}
    </SelectContext>
  );
}
