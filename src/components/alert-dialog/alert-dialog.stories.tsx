import { useState } from 'react';
import { Field } from '../form/field/field.tsx';
import { Input } from '../form/input/input.tsx';
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

/** Opens from its trigger; cancel or Escape closes it again. */
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
        <AlertDialog.Actions>
          <AlertDialog.Cancel />
          <AlertDialog.Confirm onClick={(_event, { close }) => close()}>
            Delete
          </AlertDialog.Confirm>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
});

/** The title and description can be passed as props instead of children. */
export const TitleAndDescriptionProps = meta.story({
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete order</AlertDialog.Trigger>
      <AlertDialog.Popup
        title="Delete order #1001?"
        description="The order and its invoices are removed for good. This cannot be undone."
      />
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
          <AlertDialog.Actions>
            <AlertDialog.Cancel />
            <AlertDialog.Confirm
              variant="destructive"
              onClick={() => setOrder(null)}
            >
              Delete
            </AlertDialog.Confirm>
          </AlertDialog.Actions>
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

/** Destroys data, so the confirm button is red. */
export const Destructive = meta.story({
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger variant="secondary">
        Delete order
      </AlertDialog.Trigger>
      <AlertDialog.Popup
        title="Delete order #1001?"
        description="The order and its invoices are removed for good."
      >
        <AlertDialog.Actions>
          <AlertDialog.Cancel />
          <AlertDialog.Confirm
            variant="destructive"
            onClick={(_event, { close }) => close()}
          >
            Delete
          </AlertDialog.Confirm>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
});

function SlowRequest({ fails }: { fails: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AlertDialog.Root onOpenChange={() => setError(null)}>
      <AlertDialog.Trigger variant="secondary">
        Delete order
      </AlertDialog.Trigger>
      <AlertDialog.Popup
        title="Delete order #1001?"
        description="The order and its invoices are removed for good."
      >
        {error && <p className="type-body-md m-0 text-red-600">{error}</p>}
        <AlertDialog.Actions>
          <AlertDialog.Cancel />
          <AlertDialog.Confirm
            variant="destructive"
            loading={loading}
            onClick={(_event, { close }) => {
              setLoading(true);
              setError(null);
              setTimeout(() => {
                setLoading(false);
                if (fails) setError('The order could not be deleted.');
                else close();
              }, 2000);
            }}
          >
            Delete
          </AlertDialog.Confirm>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}

/**
 * While the request runs, confirm shows a spinner and the dialog cannot be
 * closed: cancel is disabled and Escape does nothing. It closes on success.
 */
export const Loading = meta.story({
  render: () => <SlowRequest fails={false} />,
});

/** When the request fails, the dialog stays open so the user can retry. */
export const FailedRequest = meta.story({
  render: () => <SlowRequest fails />,
});

function TypeToConfirmDialog() {
  const [typed, setTyped] = useState('');
  const expected = 'grace@example.com';

  return (
    <AlertDialog.Root onOpenChange={() => setTyped('')}>
      <AlertDialog.Trigger variant="secondary">
        Remove team member
      </AlertDialog.Trigger>
      <AlertDialog.Popup
        title="Remove Grace Hopper from the team?"
        description="They lose access to the admin panel immediately."
      >
        <Field label={`Type "${expected}" to confirm`} name="confirmation">
          <Input
            autoComplete="off"
            value={typed}
            onChange={(event) => setTyped(event.currentTarget.value)}
          />
        </Field>
        <AlertDialog.Actions>
          <AlertDialog.Cancel />
          <AlertDialog.Confirm
            variant="destructive"
            disabled={typed !== expected}
            onClick={(_event, { close }) => close()}
          >
            Remove
          </AlertDialog.Confirm>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}

/** Confirm stays disabled until the user types the expected text. */
export const TypeToConfirm = meta.story({
  render: () => <TypeToConfirmDialog />,
});
