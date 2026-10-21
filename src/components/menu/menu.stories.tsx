import DeleteBinLine from '@iconify-icons/ri/delete-bin-line';
import EyeOffLine from '@iconify-icons/ri/eye-off-line';
import PencilLine from '@iconify-icons/ri/pencil-line';
import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview.tsx';
import { Button } from '../form/button/button.tsx';
import { Menu } from './menu.ts';

const onEdit = fn();
const onHide = fn();
const onDelete = fn();

const meta = preview.meta({
  title: 'Molecules/Menu',
  component: Menu.Root,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ height: 240 }}>
        <Story />
      </div>
    ),
  ],
});

/** The trigger is unstyled; here it renders as a button. */
export const Default = meta.story({
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="secondary" />}>
        Actions
      </Menu.Trigger>
      <Menu.Popup>
        <Menu.Item icon={PencilLine} onClick={onEdit}>
          Edit
        </Menu.Item>
        <Menu.Item icon={EyeOffLine} onClick={onHide}>
          Hide
        </Menu.Item>
        <Menu.Item
          variant="destructive"
          icon={DeleteBinLine}
          onClick={onDelete}
        >
          Delete
        </Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  ),
});

/** Items can be links, e.g. a router link; disabled items are dimmed. */
export const LinkAndDisabledItems = meta.story({
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="secondary" />}>
        Actions
      </Menu.Trigger>
      <Menu.Popup>
        <Menu.Item render={<a href="#edit" />}>Edit</Menu.Item>
        <Menu.Item disabled>Refund</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  ),
});
