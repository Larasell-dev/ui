import { TagComboboxItem } from './tag-combobox-item.tsx';
import { TagComboboxRoot } from './tag-combobox-root.tsx';

/**
 * `<TagCombobox>` with its options as `<TagCombobox.Item>` children.
 */
export const TagCombobox = Object.assign(TagComboboxRoot, {
  Item: TagComboboxItem,
});
