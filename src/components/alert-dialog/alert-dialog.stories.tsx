import { useState } from 'react';
import preview from '../../../.storybook/preview.tsx';
import { Table } from '../table/table.ts';
import { AlertDialog } from './alert-dialog.ts';

const meta = preview.meta({
  title: 'Molecules/AlertDialog',
  component: AlertDialog.Root,
  parameters: {
    layout: 'centered',
  },
});

/**
 * Opens from its trigger. Actions are not part of the component yet, so for
 * now press Escape to close it.
 */
export const Default = meta.story({
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete order</AlertDialog.Trigger>
      <AlertDialog.Popup>
        <AlertDialog.Title>Delete order #1001?</AlertDialog.Title>
        <AlertDialog.Description>
          The order and its invoices are removed for good. This cannot be
          undone.
        </AlertDialog.Description>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
});

/** The trigger takes the same variants as `Button`. */
export const SecondaryTrigger = meta.story({
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger variant="secondary">
        Discard draft
      </AlertDialog.Trigger>
      <AlertDialog.Popup>
        <AlertDialog.Title>Discard this draft?</AlertDialog.Title>
        <AlertDialog.Description>
          Your unsaved changes will be lost.
        </AlertDialog.Description>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
});

/** Open on load, to review the popup on its own. */
export const Open = meta.story({
  render: () => (
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup>
        <AlertDialog.Title>
          Remove Grace Hopper from the team?
        </AlertDialog.Title>
        <AlertDialog.Description>
          They lose access to the admin panel immediately. You can invite them
          again later.
        </AlertDialog.Description>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
});

function OpenFromMenu() {
  const [order, setOrder] = useState<string | null>(null);

  return (
    <>
      <Table.Root aria-label="Orders">
        <Table.Content>
          <Table.Header>
            <Table.Column>Order</Table.Column>
            <Table.Column type="action">Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {['#1001', '#1002', '#1003'].map((id) => (
              <Table.Row key={id}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>
                  <Table.Actions>
                    <Table.ActionsTrigger aria-label={`Actions for ${id}`} />
                    <Table.ActionsPopup>
                      <Table.ActionsItem
                        variant="destructive"
                        onClick={() => setOrder(id)}
                      >
                        Delete
                      </Table.ActionsItem>
                    </Table.ActionsPopup>
                  </Table.Actions>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.Root>

      <AlertDialog.Root
        open={order !== null}
        onOpenChange={(open) => !open && setOrder(null)}
      >
        <AlertDialog.Popup>
          <AlertDialog.Title>Delete order {order}?</AlertDialog.Title>
          <AlertDialog.Description>
            The order and its invoices are removed for good.
          </AlertDialog.Description>
        </AlertDialog.Popup>
      </AlertDialog.Root>
    </>
  );
}

/** Controlled with `open`, without a trigger, e.g. from a table row's menu. */
export const ControlledFromMenu = meta.story({
  parameters: { layout: 'padded' },
  render: () => <OpenFromMenu />,
});

/**
 * A title that wraps is balanced, so its lines have a similar length instead
 * of one short word on the last line.
 */
export const BalancedTitle = meta.story({
  render: () => (
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup>
        <AlertDialog.Title>
          Remove Grace Hopper and every pending invitation from the team?
        </AlertDialog.Title>
        <AlertDialog.Description>
          They lose access right away.
        </AlertDialog.Description>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
});

/**
 * A long description wraps prettily, so its last line never holds a single
 * word on its own.
 */
export const PrettyDescription = meta.story({
  render: () => (
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Popup>
        <AlertDialog.Title>Delete order #1001?</AlertDialog.Title>
        <AlertDialog.Description>
          The order, its invoices, its shipping labels and every note your team
          left on it are removed for good. Customers keep the emails they
          already received.
        </AlertDialog.Description>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
});
