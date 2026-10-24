import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { MoreLine } from '../../../icons.ts';
import { Icon } from '../../icon/icon.tsx';
import { Menu } from '../../menu/menu.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { ButtonGroup } from './button-group.tsx';

test('is a group named by its label', async () => {
  const screen = await render(
    <ButtonGroup label="Order actions">
      <Button>Save</Button>
      <Button variant="secondary">Cancel</Button>
    </ButtonGroup>,
  );

  const group = screen.getByRole('group', { name: 'Order actions' });

  await expect.element(group).toBeInTheDocument();
  expect(group.getByRole('button').elements()).toHaveLength(2);
});

test('throws when a Button inside it sets its own size', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  await expect(
    render(
      <ButtonGroup label="Actions" size="sm">
        <Button size="md">Save</Button>
      </ButtonGroup>,
    ),
  ).rejects.toThrow(
    '<Button> inside <ButtonGroup> takes its size from the group; remove its size prop.',
  );
});

test('throws when an IconButton inside it sets its own size', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  await expect(
    render(
      <ButtonGroup label="Actions">
        <IconButton aria-label="Add" size="sm">
          <Icon icon={MoreLine} />
        </IconButton>
      </ButtonGroup>,
    ),
  ).rejects.toThrow(
    '<IconButton> inside <ButtonGroup> takes its size from the group; remove its size prop.',
  );
});

test('opens a menu from a button in it', async () => {
  const onDuplicate = vi.fn();
  const screen = await render(
    <ButtonGroup label="Order actions">
      <Button>Save</Button>
      <Menu.Root>
        <Menu.Trigger
          render={
            <IconButton aria-label="More actions">
              <Icon icon={MoreLine} />
            </IconButton>
          }
        />
        <Menu.Popup>
          <Menu.Item onClick={onDuplicate}>Duplicate</Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </ButtonGroup>,
  );

  await screen.getByRole('button', { name: 'More actions' }).click();
  await screen.getByRole('menuitem', { name: 'Duplicate' }).click();

  expect(onDuplicate).toHaveBeenCalledOnce();
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <ButtonGroup label="Actions" className="mt-4">
      <Button>Save</Button>
    </ButtonGroup>,
  );

  await expect
    .element(screen.getByRole('group', { name: 'Actions' }))
    .not.toHaveClass('mt-4');
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await render(
    <ButtonGroup label="Actions" DANGEROUS_className="mt-4">
      <Button>Save</Button>
    </ButtonGroup>,
  );

  const group = screen.getByRole('group', { name: 'Actions' });

  await expect.element(group).toHaveClass('mt-4');
  await expect.element(group).toHaveClass('inline-flex');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <ButtonGroup label="Actions" style={{ marginTop: 16 }}>
      <Button>Save</Button>
    </ButtonGroup>,
  );

  await expect
    .element(screen.getByRole('group', { name: 'Actions' }))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await render(
    <ButtonGroup label="Actions" DANGEROUS_style={{ marginTop: '16px' }}>
      <Button>Save</Button>
    </ButtonGroup>,
  );

  await expect
    .element(screen.getByRole('group', { name: 'Actions' }))
    .toHaveStyle({ marginTop: '16px' });
});

test('requires a label', () => {
  // Type checks only.
  const withoutLabel = (
    // @ts-expect-error a group needs a label
    <ButtonGroup>
      <Button>Save</Button>
    </ButtonGroup>
  );

  expect(withoutLabel).toBeTruthy();
});

test('disabled disables every button in it, icon buttons and menu triggers too', async () => {
  const onSave = vi.fn();
  const onAdd = vi.fn();
  const screen = await render(
    <ButtonGroup label="Actions" disabled>
      <Button onClick={onSave}>Save</Button>
      <IconButton aria-label="Add" onClick={onAdd}>
        <Icon icon={MoreLine} />
      </IconButton>
      <Menu.Root>
        <Menu.Trigger
          render={
            <IconButton aria-label="More actions">
              <Icon icon={MoreLine} />
            </IconButton>
          }
        />
        <Menu.Popup>
          <Menu.Item>Duplicate</Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </ButtonGroup>,
  );

  const buttons = ['Save', 'Add', 'More actions'].map((name) =>
    screen.getByRole('button', { name }),
  );
  for (const button of buttons) {
    await expect.element(button).toBeDisabled();
    await userEvent.click(button, { force: true });
  }

  expect(onSave).not.toHaveBeenCalled();
  expect(onAdd).not.toHaveBeenCalled();
  await expect.element(screen.getByRole('menu')).not.toBeInTheDocument();
});

test('a disabled group takes a loading button out of the tab order too', async () => {
  const screen = await render(
    <>
      <ButtonGroup label="Actions" disabled>
        <Button loading>Save</Button>
      </ButtonGroup>
      <button type="button">Next</button>
    </>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Save' }))
    .toBeDisabled();
  await userEvent.tab();
  await expect
    .element(screen.getByRole('button', { name: 'Next' }))
    .toHaveFocus();
});

test('a loading button in it stays focusable but looks disabled and ignores presses', async () => {
  const onSave = vi.fn();
  const screen = await render(
    <ButtonGroup label="Actions">
      <Button loading onClick={onSave}>
        Save
      </Button>
      <IconButton aria-label="More save options">
        <Icon icon={MoreLine} />
      </IconButton>
    </ButtonGroup>,
  );

  const save = screen.getByRole('button', { name: 'Save' });

  await userEvent.tab();
  await expect.element(save).toHaveFocus();
  await expect.element(save).toHaveAttribute('aria-disabled', 'true');
  await expect.element(save).toHaveAttribute('data-disabled');

  await userEvent.keyboard('{Enter}');
  await userEvent.click(save, { force: true });
  expect(onSave).not.toHaveBeenCalled();
});

test('the arrow keys move onto and off a loading button in it', async () => {
  const screen = await render(
    <ButtonGroup label="Actions">
      <Button variant="secondary">Edit</Button>
      <Button loading>Save</Button>
      <Button variant="secondary">Archive</Button>
    </ButtonGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard('{ArrowRight}');
  await expect
    .element(screen.getByRole('button', { name: 'Save' }))
    .toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await expect
    .element(screen.getByRole('button', { name: 'Archive' }))
    .toHaveFocus();
});
