import { useState } from 'react';
import { expect, test } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Button } from '../form/button/button.tsx';
import { Slideover } from './slideover.ts';

function AddAddress() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add address</Button>
      <Slideover.Root open={open} onOpenChange={setOpen}>
        <Slideover.Header
          title="New address"
          description="Where the customer receives orders."
          closeLabel="Close panel"
        />
        <Slideover.Content>Fields</Slideover.Content>
        <Slideover.Footer>
          <Slideover.Actions>
            <Slideover.Close />
            <Button>Save</Button>
          </Slideover.Actions>
        </Slideover.Footer>
      </Slideover.Root>
    </>
  );
}

// Without styles, Base UI's inert overlay sits above the popup, so press from the keyboard.
async function press(locator: { element: () => Element }) {
  (locator.element() as HTMLElement).focus();
  await userEvent.keyboard('{Enter}');
}

test('opens as a dialog named and described by its header', async () => {
  // Arrange
  const screen = await render(<AddAddress />);

  // Act
  await screen.getByRole('button', { name: 'Add address' }).click();

  // Assert
  const dialog = screen.getByRole('dialog', { name: 'New address' });
  await expect.element(dialog).toBeVisible();
  await expect
    .element(dialog)
    .toHaveAccessibleDescription('Where the customer receives orders.');
});

test.each([['Close panel'], ['Cancel']])(
  'closes from the %s button',
  async (name) => {
    // Arrange
    const screen = await render(<AddAddress />);
    await screen.getByRole('button', { name: 'Add address' }).click();

    // Act
    await press(screen.getByRole('button', { name }));

    // Assert
    await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  },
);
