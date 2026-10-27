import { expect, fn, screen } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDownSLine,
  DeleteBinLine,
  FileCopyLine,
  MoreLine,
  Settings3Line,
} from '../../../icons.ts';
import { Icon } from '../../icon/icon.tsx';
import { Menu } from '../../menu/menu.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { ButtonGroup } from './button-group.tsx';

const onSave = fn();
const onSaveAsDraft = fn();
const onSaveAndClose = fn();
const onDuplicate = fn();
const onDelete = fn();

const meta = preview.meta({
  title: 'Molecules/ButtonGroup',
  component: ButtonGroup,
  args: {
    label: 'Order actions',
    children: (
      <>
        <Button variant="secondary">Edit</Button>
        <Button variant="secondary">Preview</Button>
        <IconButton variant="secondary" aria-label="Settings">
          <Icon icon={Settings3Line} />
        </IconButton>
      </>
    ),
  },
  parameters: {
    layout: 'centered',
  },
});

/** Buttons and icon buttons side by side, sharing their borders. */
export const Default = meta.story({});

/** The group sets the size of every button in it; the buttons may not set their own. */
export const Small = meta.story({
  args: { size: 'sm' },
});

/** Solid buttons draw a divider between them. */
export const Primary = meta.story({
  args: {
    children: (
      <>
        <Button>Save</Button>
        <Button>Publish</Button>
        <IconButton aria-label="Duplicate">
          <Icon icon={FileCopyLine} />
        </IconButton>
      </>
    ),
  },
});

export const Destructive = meta.story({
  args: {
    children: (
      <>
        <Button variant="destructive">Delete</Button>
        <IconButton variant="destructive" aria-label="Delete forever">
          <Icon icon={DeleteBinLine} />
        </IconButton>
      </>
    ),
  },
});

export const Tertiary = meta.story({
  args: {
    label: 'Text alignment',
    children: (
      <>
        <IconButton variant="tertiary" aria-label="Align left">
          <Icon icon={AlignLeft} />
        </IconButton>
        <IconButton variant="tertiary" aria-label="Align center">
          <Icon icon={AlignCenter} />
        </IconButton>
        <IconButton variant="tertiary" aria-label="Align right">
          <Icon icon={AlignRight} />
        </IconButton>
      </>
    ),
  },
});

/** `disabled` on the group disables every button in it. */
export const Disabled = meta.story({
  args: { disabled: true },
});

/** A disabled button stays in place, dimmed, between its neighbours. */
export const WithDisabledButton = meta.story({
  args: {
    children: (
      <>
        <Button variant="secondary">Edit</Button>
        <Button variant="secondary" disabled>
          Refund
        </Button>
        <Button variant="secondary">Archive</Button>
      </>
    ),
  },
});

/** A loading button keeps its width, so its neighbours do not move. */
export const WithLoadingButton = meta.story({
  args: {
    children: (
      <>
        <Button loading>Save</Button>
        <Menu.Root defaultOpen>
          <Menu.Trigger
            render={
              <IconButton aria-label="More save options">
                <Icon icon={ArrowDownSLine} />
              </IconButton>
            }
          />
          <Menu.Popup>
            <Menu.Item onClick={onSaveAsDraft}>Save as draft</Menu.Item>
            <Menu.Item onClick={onSaveAndClose}>Save and close</Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ height: 200 }}>
        <Story />
      </div>
    ),
  ],
});

/**
 * A split button: the main action, and a menu of the other ones opened from
 * an icon button. The trigger renders as the IconButton, so it takes the
 * group's size and styling like any other button in it.
 */
export const WithMenu = meta.story({
  args: {
    children: (
      <>
        <Button onClick={onSave}>Save</Button>
        <Menu.Root>
          <Menu.Trigger
            render={
              <IconButton aria-label="More actions">
                <Icon icon={MoreLine} />
              </IconButton>
            }
          />
          <Menu.Popup>
            <Menu.Item icon={FileCopyLine} onClick={onDuplicate}>
              Duplicate
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
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ height: 200 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'More actions' });

    await userEvent.click(trigger);

    // The popup renders in a portal, outside the story's canvas.
    await expect(await screen.findByRole('menu')).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      screen.getByRole('menuitem', { name: 'Duplicate' }),
    ).toBeVisible();
    await expect(
      screen.getByRole('menuitem', { name: 'Delete' }),
    ).toBeVisible();
  },
});
