import { useState } from 'react';
import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { AlertDialog } from './alert-dialog.ts';

function DeleteOrder({
  onConfirm = vi.fn(),
  loading,
  disabled,
}: {
  onConfirm?: (close: () => void) => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete order</AlertDialog.Trigger>
      <AlertDialog.Popup title="Delete order #1001?">
        <AlertDialog.Actions>
          <AlertDialog.Cancel />
          <AlertDialog.Confirm
            loading={loading}
            disabled={disabled}
            onClick={(_event, { close }) => onConfirm(close)}
          >
            Delete
          </AlertDialog.Confirm>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}

/**
 * Tests run without the stylesheet, so the popup is not layered above Base
 * UI's inert overlay and pointer clicks would land on the overlay. Press the
 * button from the keyboard instead, the way a keyboard user would.
 */
async function press(locator: { element: () => Element }) {
  (locator.element() as HTMLElement).focus();
  await userEvent.keyboard('{Enter}');
}

/** A DOM click, which still respects disabled buttons. */
function domClick(locator: { element: () => Element }) {
  (locator.element() as HTMLElement).click();
}

async function open(screen: Awaited<ReturnType<typeof render>>) {
  await screen.getByRole('button', { name: 'Delete order' }).click();
  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
}

test('cancel closes the dialog and is labelled "Cancel" by default', async () => {
  const screen = await render(<DeleteOrder />);
  await open(screen);

  await press(screen.getByRole('button', { name: 'Cancel' }));

  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: 'Delete order' }))
    .toHaveFocus();
});

test('cancel takes a custom label', async () => {
  const screen = await render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup title="Delete order #1001?">
        <AlertDialog.Actions>
          <AlertDialog.Cancel>Keep order</AlertDialog.Cancel>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Keep order' }))
    .toBeVisible();
});

test('confirm runs its handler without closing the dialog', async () => {
  const onConfirm = vi.fn();
  const screen = await render(<DeleteOrder onConfirm={onConfirm} />);
  await open(screen);

  await press(screen.getByRole('button', { name: 'Delete' }));

  expect(onConfirm).toHaveBeenCalledOnce();
  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
});

test('confirm can close the dialog, e.g. once a request succeeds', async () => {
  const screen = await render(<DeleteOrder onConfirm={(close) => close()} />);
  await open(screen);

  await press(screen.getByRole('button', { name: 'Delete' }));

  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: 'Delete order' }))
    .toHaveFocus();
});

test('a disabled confirm does not run its handler', async () => {
  const onConfirm = vi.fn();
  const screen = await render(<DeleteOrder onConfirm={onConfirm} disabled />);
  await open(screen);

  const confirm = screen.getByRole('button', { name: 'Delete' });
  await expect.element(confirm).toBeDisabled();
  domClick(confirm);

  expect(onConfirm).not.toHaveBeenCalled();
});

test('while loading, the dialog cannot be closed', async () => {
  const onConfirm = vi.fn();
  const screen = await render(<DeleteOrder onConfirm={onConfirm} loading />);
  await open(screen);

  const confirm = screen.getByRole('button', { name: 'Delete' });
  await expect.element(confirm).toHaveAttribute('aria-busy', 'true');
  await expect
    .element(screen.getByRole('button', { name: 'Cancel' }))
    .toBeDisabled();

  await userEvent.keyboard('{Escape}');
  domClick(confirm);

  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
  expect(onConfirm).not.toHaveBeenCalled();
});

test('can be closed again once loading finishes', async () => {
  function Deleting() {
    const [loading, setLoading] = useState(false);
    return (
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Popup title="Delete order #1001?">
          <AlertDialog.Actions>
            <AlertDialog.Cancel />
            <AlertDialog.Confirm
              loading={loading}
              onClick={() => setLoading(true)}
            >
              Delete
            </AlertDialog.Confirm>
          </AlertDialog.Actions>
        </AlertDialog.Popup>
        <button type="button" onClick={() => setLoading(false)}>
          Fail request
        </button>
      </AlertDialog.Root>
    );
  }

  const screen = await render(<Deleting />);
  await press(screen.getByRole('button', { name: 'Delete' }));
  await userEvent.keyboard('{Escape}');
  await expect.element(screen.getByRole('alertdialog')).toBeVisible();

  // The dialog makes the page outside it inert, so finish the request with a DOM click.
  domClick(
    screen.getByRole('button', { name: 'Fail request', includeHidden: true }),
  );
  await expect
    .element(screen.getByRole('button', { name: 'Cancel' }))
    .toBeEnabled();
  await userEvent.keyboard('{Escape}');

  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
});

test('close still works while loading, e.g. from a request that just succeeded', async () => {
  // Inertia calls onSuccess before onFinish, so the button is still loading when close runs.
  let closeDialog = () => {};
  const screen = await render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup title="Delete order #1001?">
        {({ close }) => {
          closeDialog = close;
          return (
            <AlertDialog.Actions>
              <AlertDialog.Confirm loading>Delete</AlertDialog.Confirm>
            </AlertDialog.Actions>
          );
        }}
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );
  await expect.element(screen.getByRole('alertdialog')).toBeVisible();

  closeDialog();

  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
});

test('a controlled dialog does not ask to close while loading', async () => {
  const onOpenChange = vi.fn();
  const screen = await render(
    <AlertDialog.Root open onOpenChange={onOpenChange}>
      <AlertDialog.Popup title="Delete order #1001?">
        <AlertDialog.Actions>
          <AlertDialog.Cancel />
          <AlertDialog.Confirm loading>Delete</AlertDialog.Confirm>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );
  await expect.element(screen.getByRole('alertdialog')).toBeVisible();

  await userEvent.keyboard('{Escape}');

  expect(onOpenChange).not.toHaveBeenCalled();
});

test('the popup can pass close to its children, e.g. for a form', async () => {
  const onSubmit = vi.fn();
  const screen = await render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup title="Delete order #1001?">
        {({ close }) => (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
              close();
            }}
          >
            <AlertDialog.Actions>
              <AlertDialog.Cancel />
              <AlertDialog.Confirm type="submit">Delete</AlertDialog.Confirm>
            </AlertDialog.Actions>
          </form>
        )}
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );

  await press(screen.getByRole('button', { name: 'Delete' }));

  expect(onSubmit).toHaveBeenCalledOnce();
  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
});

test('cancel never submits a surrounding form', async () => {
  const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
  const screen = await render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup title="Delete order #1001?">
        <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
          <AlertDialog.Actions>
            <AlertDialog.Cancel />
          </AlertDialog.Actions>
        </form>
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );

  await press(screen.getByRole('button', { name: 'Cancel' }));

  expect(onSubmit).not.toHaveBeenCalled();
});

test('the actions take a limited set of props', async () => {
  const screen = await render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup title="Delete order #1001?">
        {/* @ts-expect-error the actions slot cannot be restyled */}
        <AlertDialog.Actions className="mt-4">
          {/* @ts-expect-error cancel is always secondary */}
          <AlertDialog.Cancel variant="primary" />
          {/* @ts-expect-error className is blocked */}
          <AlertDialog.Confirm className="mt-4">Delete</AlertDialog.Confirm>
          {/* @ts-expect-error confirm cannot be restyled */}
          <AlertDialog.Confirm DANGEROUS_className="mt-4">
            Delete
          </AlertDialog.Confirm>
          {/* @ts-expect-error confirm is never full width */}
          <AlertDialog.Confirm fullWidth>Delete</AlertDialog.Confirm>
          {/* @ts-expect-error unknown variant */}
          <AlertDialog.Confirm variant="danger">Delete</AlertDialog.Confirm>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );

  for (const button of screen.getByRole('button', { name: 'Delete' }).all()) {
    await expect.element(button).not.toHaveClass('mt-4');
  }
});
