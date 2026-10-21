import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Button } from '../form/button/button.tsx';
import { Menu } from './menu.ts';

test('opens from a trigger rendered as another component and runs the chosen item', async () => {
  const onHide = vi.fn();
  const screen = await render(
    <Menu.Root>
      <Menu.Trigger render={<Button variant="secondary" />}>
        Actions
      </Menu.Trigger>
      <Menu.Popup>
        <Menu.Item onClick={onHide}>Hide</Menu.Item>
      </Menu.Popup>
    </Menu.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Actions' });
  await expect.element(trigger).toHaveAttribute('aria-haspopup', 'menu');
  await trigger.click();
  await screen.getByRole('menuitem', { name: 'Hide' }).click();

  expect(onHide).toHaveBeenCalledOnce();
  await expect.element(screen.getByRole('menu')).not.toBeInTheDocument();
});

test('the trigger takes Base UI trigger props such as tabIndex', async () => {
  const screen = await render(
    <>
      <Menu.Root>
        <Menu.Trigger tabIndex={-1}>Actions</Menu.Trigger>
      </Menu.Root>
      <button type="button">Next</button>
    </>,
  );

  await userEvent.tab();
  await expect
    .element(screen.getByRole('button', { name: 'Next' }))
    .toHaveFocus();
});

test('the trigger is unstyled and takes className and style', async () => {
  const screen = await render(
    <Menu.Root>
      <Menu.Trigger className="mt-4" style={{ marginLeft: '16px' }}>
        Actions
      </Menu.Trigger>
    </Menu.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Actions' });
  await expect.element(trigger).toHaveAttribute('class', 'mt-4');
  await expect.element(trigger).toHaveStyle({ marginLeft: '16px' });
});
