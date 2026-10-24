import { useState } from 'react';
import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Button } from '../form/button/button.tsx';
import { Dialog } from './dialog.ts';

function EditOrder() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Edit order</Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Title>Edit order #1001</Dialog.Title>
        <Dialog.Description>
          Changes apply to open invoices too.
        </Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close />
        </Dialog.Actions>
      </Dialog.Popup>
    </Dialog.Root>
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

test('opens from the trigger as a dialog named by its title', async () => {
  const screen = await render(<EditOrder />);

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await screen.getByRole('button', { name: 'Edit order' }).click();

  const dialog = screen.getByRole('dialog', { name: 'Edit order #1001' });
  await expect.element(dialog).toBeVisible();
  await expect
    .element(dialog)
    .toHaveAccessibleDescription('Changes apply to open invoices too.');
});

test('is a dialog, not an alert dialog', async () => {
  const screen = await render(<EditOrder />);
  await screen.getByRole('button', { name: 'Edit order' }).click();

  await expect.element(screen.getByRole('dialog')).toBeVisible();
  await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
});

test('takes the title and description as props', async () => {
  const screen = await render(
    <Dialog.Root defaultOpen>
      <Dialog.Popup
        title="Edit order #1001"
        description="Changes apply to open invoices too."
      />
    </Dialog.Root>,
  );

  const dialog = screen.getByRole('dialog', { name: 'Edit order #1001' });
  await expect.element(dialog).toBeVisible();
  await expect
    .element(dialog)
    .toHaveAccessibleDescription('Changes apply to open invoices too.');
  await expect
    .element(screen.getByRole('heading', { name: 'Edit order #1001' }))
    .toBeVisible();
});

test('renders children after the title and description props', async () => {
  const screen = await render(
    <Dialog.Root defaultOpen>
      <Dialog.Popup title="Edit order #1001" description="Applies to invoices.">
        <p>Extra details</p>
      </Dialog.Popup>
    </Dialog.Root>,
  );

  const texts = screen.getByRole('dialog').element().textContent;
  expect(texts).toBe('Edit order #1001Applies to invoices.Extra details');
});

test('moves focus into the dialog and back to the trigger when it closes', async () => {
  const screen = await render(<EditOrder />);
  const trigger = screen.getByRole('button', { name: 'Edit order' });

  await trigger.click();
  const dialog = screen.getByRole('dialog');
  await expect
    .poll(() => dialog.element().contains(document.activeElement))
    .toBe(true);

  await userEvent.keyboard('{Escape}');

  await expect.element(dialog).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
});

test('closes when clicking outside', async () => {
  const screen = await render(<EditOrder />);
  await screen.getByRole('button', { name: 'Edit order' }).click();
  await expect.element(screen.getByRole('dialog')).toBeVisible();

  await userEvent.click(document.body, { position: { x: 5, y: 5 } });

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
});

test('close closes the dialog and is labelled "Close" by default', async () => {
  const screen = await render(<EditOrder />);
  const trigger = screen.getByRole('button', { name: 'Edit order' });
  await trigger.click();
  await expect.element(screen.getByRole('dialog')).toBeVisible();

  await press(screen.getByRole('button', { name: 'Close' }));

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
});

test('close takes a custom label', async () => {
  const screen = await render(
    <Dialog.Root defaultOpen>
      <Dialog.Popup title="Edit order #1001">
        <Dialog.Actions>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Actions>
      </Dialog.Popup>
    </Dialog.Root>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Cancel' }))
    .toBeVisible();
});

test('close never submits a surrounding form', async () => {
  const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
  const screen = await render(
    <Dialog.Root defaultOpen>
      <Dialog.Popup title="Edit order #1001">
        <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
          <Dialog.Actions>
            <Dialog.Close />
          </Dialog.Actions>
        </form>
      </Dialog.Popup>
    </Dialog.Root>,
  );

  await press(screen.getByRole('button', { name: 'Close' }));

  expect(onSubmit).not.toHaveBeenCalled();
});

test('the popup can pass close to its children, e.g. for a form', async () => {
  const onSubmit = vi.fn();
  const screen = await render(
    <Dialog.Root defaultOpen>
      <Dialog.Popup title="Edit order #1001">
        {({ close }) => (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
              close();
            }}
          >
            <Dialog.Actions>
              <Dialog.Close>Cancel</Dialog.Close>
              <Button type="submit">Save</Button>
            </Dialog.Actions>
          </form>
        )}
      </Dialog.Popup>
    </Dialog.Root>,
  );

  await press(screen.getByRole('button', { name: 'Save' }));

  expect(onSubmit).toHaveBeenCalledOnce();
  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
});

test('can be opened and closed by the parent without a trigger', async () => {
  const onOpenChange = vi.fn();

  function Controlled() {
    const [open, setOpen] = useState(true);
    return (
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
      >
        <Dialog.Popup title="Edit order #1001" />
      </Dialog.Root>
    );
  }

  const screen = await render(<Controlled />);
  await expect
    .element(screen.getByRole('dialog', { name: 'Edit order #1001' }))
    .toBeVisible();

  await userEvent.keyboard('{Escape}');

  expect(onOpenChange).toHaveBeenCalledWith(false);
  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
});

test('stays open when the parent keeps it open', async () => {
  const screen = await render(
    <Dialog.Root open onOpenChange={() => {}}>
      <Dialog.Popup title="Edit order #1001" />
    </Dialog.Root>,
  );

  await userEvent.keyboard('{Escape}');
  await userEvent.click(document.body, { position: { x: 5, y: 5 } });

  await expect.element(screen.getByRole('dialog')).toBeVisible();
});

test('the trigger can be disabled', async () => {
  const screen = await render(
    <Dialog.Root>
      <Dialog.Trigger disabled>Edit order</Dialog.Trigger>
      <Dialog.Popup title="Edit order #1001" />
    </Dialog.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Edit order' });
  await expect.element(trigger).toBeDisabled();
  await trigger.click({ force: true });

  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
});

test('the trigger renders the element passed to render', async () => {
  const screen = await render(
    <>
      <Button variant="secondary">Reference</Button>
      <Dialog.Root>
        <Dialog.Trigger render={<Button variant="secondary" />}>
          Edit order
        </Dialog.Trigger>
        <Dialog.Popup title="Edit order #1001" />
      </Dialog.Root>
    </>,
  );

  const trigger = screen.getByRole('button', { name: 'Edit order' });
  const reference = screen.getByRole('button', { name: 'Reference' });
  expect(trigger.element().className).toBe(reference.element().className);
  await trigger.click();

  await expect.element(screen.getByRole('dialog')).toBeVisible();
});

test('the trigger has no styling of its own', async () => {
  const screen = await render(
    <Dialog.Root>
      <Dialog.Trigger>Edit order</Dialog.Trigger>
    </Dialog.Root>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Edit order' }))
    .not.toHaveAttribute('class');
});

test('the trigger drops className and style from the element passed to render', async () => {
  const screen = await render(
    <Dialog.Root>
      <Dialog.Trigger
        nativeButton={false}
        render={<span className="mt-4" style={{ marginLeft: '16px' }} />}
      >
        Edit order
      </Dialog.Trigger>
    </Dialog.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Edit order' });
  await expect.element(trigger).not.toHaveClass('mt-4');
  await expect.element(trigger).not.toHaveStyle({ marginLeft: '16px' });
});

test('the trigger can be restyled through the DANGEROUS_ props', async () => {
  const screen = await render(
    <Dialog.Root>
      <Dialog.Trigger
        DANGEROUS_className="mt-4"
        DANGEROUS_style={{ marginLeft: '16px' }}
      >
        Edit order
      </Dialog.Trigger>
    </Dialog.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Edit order' });
  await expect.element(trigger).toHaveClass('mt-4');
  await expect.element(trigger).toHaveStyle({ marginLeft: '16px' });
});

test('the popup, title, description and actions cannot be restyled', async () => {
  const screen = await render(
    <Dialog.Root defaultOpen>
      {/* @ts-expect-error only the trigger can be restyled */}
      <Dialog.Popup DANGEROUS_className="mt-4" className="mt-4">
        {/* @ts-expect-error only the trigger can be restyled */}
        <Dialog.Title className="mt-4" DANGEROUS_className="mt-4">
          Edit order #1001
        </Dialog.Title>
        {/* @ts-expect-error only the trigger can be restyled */}
        <Dialog.Description style={{ marginLeft: '16px' }}>
          Applies to invoices.
        </Dialog.Description>
        {/* @ts-expect-error the actions slot cannot be restyled */}
        <Dialog.Actions className="mt-4">
          {/* @ts-expect-error close is always secondary */}
          <Dialog.Close variant="primary" />
        </Dialog.Actions>
      </Dialog.Popup>
    </Dialog.Root>,
  );

  await expect.element(screen.getByRole('dialog')).not.toHaveClass('mt-4');
  await expect
    .element(screen.getByRole('heading', { name: 'Edit order #1001' }))
    .not.toHaveClass('mt-4');
  await expect
    .element(screen.getByText('Applies to invoices.'))
    .not.toHaveStyle({ marginLeft: '16px' });
});
