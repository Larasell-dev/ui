import { useState } from 'react';
import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { AlertDialog } from './alert-dialog.ts';

function DeleteOrder() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete order</AlertDialog.Trigger>
      <AlertDialog.Popup>
        <AlertDialog.Title>Delete order #1001?</AlertDialog.Title>
        <AlertDialog.Description>
          The order and its invoices are removed for good.
        </AlertDialog.Description>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}

test('opens from the trigger as an alert dialog named by its title', async () => {
  const screen = await render(<DeleteOrder />);

  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
  await screen.getByRole('button', { name: 'Delete order' }).click();

  const dialog = screen.getByRole('alertdialog', {
    name: 'Delete order #1001?',
  });
  await expect.element(dialog).toBeVisible();
  await expect
    .element(dialog)
    .toHaveAccessibleDescription(
      'The order and its invoices are removed for good.',
    );
});

test('renders the title as a heading', async () => {
  const screen = await render(<DeleteOrder />);
  await screen.getByRole('button', { name: 'Delete order' }).click();

  await expect
    .element(screen.getByRole('heading', { name: 'Delete order #1001?' }))
    .toBeVisible();
});

test('moves focus into the dialog and back to the trigger when it closes', async () => {
  const screen = await render(<DeleteOrder />);
  const trigger = screen.getByRole('button', { name: 'Delete order' });

  await trigger.click();
  const dialog = screen.getByRole('alertdialog');
  await expect
    .poll(() => dialog.element().contains(document.activeElement))
    .toBe(true);

  await userEvent.keyboard('{Escape}');

  await expect.element(dialog).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
});

test('does not close when clicking outside', async () => {
  const screen = await render(<DeleteOrder />);
  await screen.getByRole('button', { name: 'Delete order' }).click();
  await expect.element(screen.getByRole('alertdialog')).toBeVisible();

  await userEvent.click(document.body, { position: { x: 5, y: 5 } });

  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
});

test('can be opened and closed by the parent without a trigger', async () => {
  const onOpenChange = vi.fn();

  function Controlled() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          Reopen
        </button>
        <AlertDialog.Root
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <AlertDialog.Popup>
            <AlertDialog.Title>Discard changes?</AlertDialog.Title>
          </AlertDialog.Popup>
        </AlertDialog.Root>
      </>
    );
  }

  const screen = await render(<Controlled />);
  await expect
    .element(screen.getByRole('alertdialog', { name: 'Discard changes?' }))
    .toBeVisible();

  await userEvent.keyboard('{Escape}');

  expect(onOpenChange).toHaveBeenCalledWith(false);
  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
});

test('stays open when the parent keeps it open', async () => {
  const screen = await render(
    <AlertDialog.Root open onOpenChange={() => {}}>
      <AlertDialog.Popup>
        <AlertDialog.Title>Discard changes?</AlertDialog.Title>
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );

  await userEvent.keyboard('{Escape}');

  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
});

test('the trigger can be disabled', async () => {
  const screen = await render(
    <AlertDialog.Root>
      <AlertDialog.Trigger disabled>Delete order</AlertDialog.Trigger>
      <AlertDialog.Popup>
        <AlertDialog.Title>Delete order #1001?</AlertDialog.Title>
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Delete order' });
  await expect.element(trigger).toBeDisabled();
  await trigger.click({ force: true });

  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
});

test('the trigger can be restyled through the DANGEROUS_ props', async () => {
  const screen = await render(
    <AlertDialog.Root>
      <AlertDialog.Trigger
        DANGEROUS_className="mt-4"
        DANGEROUS_style={{ marginLeft: '16px' }}
      >
        Delete order
      </AlertDialog.Trigger>
    </AlertDialog.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Delete order' });
  await expect.element(trigger).toHaveClass('mt-4');
  await expect.element(trigger).toHaveStyle({ marginLeft: '16px' });
});

test('the trigger does not accept className', async () => {
  const screen = await render(
    <AlertDialog.Root>
      {/* @ts-expect-error className is blocked; use DANGEROUS_className */}
      <AlertDialog.Trigger className="mt-4">Delete order</AlertDialog.Trigger>
    </AlertDialog.Root>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Delete order' }))
    .not.toHaveClass('mt-4');
});

test('the trigger does not accept style', async () => {
  const screen = await render(
    <AlertDialog.Root>
      <AlertDialog.Trigger
        // @ts-expect-error style is blocked; use DANGEROUS_style
        style={{ marginLeft: '16px' }}
      >
        Delete order
      </AlertDialog.Trigger>
    </AlertDialog.Root>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Delete order' }))
    .not.toHaveStyle({ marginLeft: '16px' });
});

test('the popup, title and description cannot be restyled', async () => {
  const screen = await render(
    <AlertDialog.Root defaultOpen>
      {/* @ts-expect-error only the trigger can be restyled */}
      <AlertDialog.Popup DANGEROUS_className="mt-4" className="mt-4">
        {/* @ts-expect-error only the trigger can be restyled */}
        <AlertDialog.Title className="mt-4" DANGEROUS_className="mt-4">
          Delete order #1001?
        </AlertDialog.Title>
        {/* @ts-expect-error only the trigger can be restyled */}
        <AlertDialog.Description style={{ marginLeft: '16px' }}>
          Gone for good.
        </AlertDialog.Description>
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );

  await expect.element(screen.getByRole('alertdialog')).not.toHaveClass('mt-4');
  await expect
    .element(screen.getByRole('heading', { name: 'Delete order #1001?' }))
    .not.toHaveClass('mt-4');
  await expect
    .element(screen.getByText('Gone for good.'))
    .not.toHaveStyle({ marginLeft: '16px' });
});
