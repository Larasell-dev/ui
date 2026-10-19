import { useState } from 'react';
import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Button } from '../form/button/button.tsx';
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

test('takes the title and description as props', async () => {
  const screen = await render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup
        title="Delete order #1001?"
        description="The order and its invoices are removed for good."
      />
    </AlertDialog.Root>,
  );

  const dialog = screen.getByRole('alertdialog', {
    name: 'Delete order #1001?',
  });
  await expect.element(dialog).toBeVisible();
  await expect
    .element(dialog)
    .toHaveAccessibleDescription(
      'The order and its invoices are removed for good.',
    );
  await expect
    .element(screen.getByRole('heading', { name: 'Delete order #1001?' }))
    .toBeVisible();
});

test('renders children after the title and description props', async () => {
  const screen = await render(
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup
        title="Delete order #1001?"
        description="Gone for good."
      >
        <p>Extra details</p>
      </AlertDialog.Popup>
    </AlertDialog.Root>,
  );

  const texts = screen.getByRole('alertdialog').element().textContent;
  expect(texts).toBe('Delete order #1001?Gone for good.Extra details');
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

test('the trigger renders the element passed to render', async () => {
  const screen = await render(
    <>
      <Button variant="secondary">Reference</Button>
      <AlertDialog.Root>
        <AlertDialog.Trigger render={<Button variant="secondary" />}>
          Delete order
        </AlertDialog.Trigger>
        <AlertDialog.Popup title="Delete order #1001?" />
      </AlertDialog.Root>
    </>,
  );

  const trigger = screen.getByRole('button', { name: 'Delete order' });
  const reference = screen.getByRole('button', { name: 'Reference' });
  expect(trigger.element().className).toBe(reference.element().className);
  await trigger.click();

  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
});

test('the trigger can render an element that is not a button', async () => {
  const screen = await render(
    <AlertDialog.Root>
      <AlertDialog.Trigger nativeButton={false} render={<span />}>
        Delete order
      </AlertDialog.Trigger>
      <AlertDialog.Popup title="Delete order #1001?" />
    </AlertDialog.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Delete order' });
  expect(trigger.element().tagName).toBe('SPAN');
  (trigger.element() as HTMLElement).focus();
  await userEvent.keyboard('{Enter}');

  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
});

test('the trigger has no styling of its own', async () => {
  const screen = await render(
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete order</AlertDialog.Trigger>
    </AlertDialog.Root>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Delete order' }))
    .not.toHaveAttribute('class');
});

test('the trigger drops className and style from the element passed to render', async () => {
  const screen = await render(
    <AlertDialog.Root>
      <AlertDialog.Trigger
        nativeButton={false}
        render={<span className="mt-4" style={{ marginLeft: '16px' }} />}
      >
        Delete order
      </AlertDialog.Trigger>
    </AlertDialog.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Delete order' });
  await expect.element(trigger).not.toHaveClass('mt-4');
  await expect.element(trigger).not.toHaveStyle({ marginLeft: '16px' });
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

test('the trigger passes on any other prop', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <AlertDialog.Root>
      <AlertDialog.Trigger
        id="delete-order"
        aria-label="Delete order #1001"
        data-order="1001"
        onClick={onClick}
      >
        Delete
      </AlertDialog.Trigger>
      <AlertDialog.Popup title="Delete order #1001?" />
    </AlertDialog.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Delete order #1001' });
  await expect.element(trigger).toHaveAttribute('id', 'delete-order');
  await expect.element(trigger).toHaveAttribute('data-order', '1001');
  await trigger.click();

  expect(onClick).toHaveBeenCalledOnce();
  await expect.element(screen.getByRole('alertdialog')).toBeVisible();
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
