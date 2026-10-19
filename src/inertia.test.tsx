import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { AlertDialog } from './inertia.ts';

const form = vi.hoisted(() => ({
  current: undefined as { processing: boolean } | undefined,
}));

vi.mock('@inertiajs/react', () => ({
  useFormContext: () => form.current,
}));

function DeleteOrder({ loading }: { loading?: boolean }) {
  return (
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup title="Delete order #1001?">
        <AlertDialog.Actions>
          <AlertDialog.Cancel />
          <AlertDialog.Confirm loading={loading}>Delete</AlertDialog.Confirm>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}

test('locks the dialog while the surrounding Inertia form is processing', async () => {
  form.current = { processing: true };
  const screen = await render(<DeleteOrder />);

  await expect
    .element(screen.getByRole('button', { name: 'Delete' }))
    .toHaveAttribute('aria-busy', 'true');
  await expect
    .element(screen.getByRole('button', { name: 'Cancel' }))
    .toBeDisabled();
  await userEvent.keyboard('{Escape}');
  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
});

test('submits the surrounding Inertia form', async () => {
  form.current = { processing: false };
  const screen = await render(<DeleteOrder />);

  await expect
    .element(screen.getByRole('button', { name: 'Delete' }))
    .toHaveAttribute('type', 'submit');
  await expect
    .element(screen.getByRole('button', { name: 'Cancel' }))
    .toBeEnabled();
});

test('behaves like the plain dialog outside an Inertia form', async () => {
  form.current = undefined;
  const screen = await render(<DeleteOrder />);

  const confirm = screen.getByRole('button', { name: 'Delete' });
  await expect.element(confirm).toHaveAttribute('type', 'button');
  await expect.element(confirm).not.toHaveAttribute('aria-busy');
});

test('an explicit loading prop wins over the form', async () => {
  form.current = { processing: false };
  const screen = await render(<DeleteOrder loading />);

  await expect
    .element(screen.getByRole('button', { name: 'Delete' }))
    .toHaveAttribute('aria-busy', 'true');
});
