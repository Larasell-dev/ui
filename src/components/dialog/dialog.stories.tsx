import { useState } from 'react';
import { Button } from '../form/button/button.tsx';
import { Field } from '../form/field/field.tsx';
import { Input } from '../form/input/input.tsx';
import preview from '../../../.storybook/preview.tsx';
import { Dialog } from './dialog.ts';

const meta = preview.meta({
  title: 'Molecules/Dialog',
  component: Dialog.Root,
  parameters: {
    layout: 'centered',
  },
});

/** Opens from its trigger; close, Escape or a click outside closes it again. */
export const Default = meta.story({
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger render={<Button />}>Show shipping details</Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Title>Shipping details</Dialog.Title>
        <Dialog.Description>
          Order #1001 ships with DHL Express and arrives on Tuesday.
        </Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close />
        </Dialog.Actions>
      </Dialog.Popup>
    </Dialog.Root>
  ),
});

/** The title and description can be passed as props instead of children. */
export const TitleAndDescriptionProps = meta.story({
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger render={<Button />}>Show shipping details</Dialog.Trigger>
      <Dialog.Popup
        title="Shipping details"
        description="Order #1001 ships with DHL Express and arrives on Tuesday."
      />
    </Dialog.Root>
  ),
});

/** Open on load, to review the popup on its own. */
export const Open = meta.story({
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Popup
        title="Shipping details"
        description="Order #1001 ships with DHL Express and arrives on Tuesday."
      >
        <Dialog.Actions>
          <Dialog.Close />
        </Dialog.Actions>
      </Dialog.Popup>
    </Dialog.Root>
  ),
});

function RenameOrder() {
  const [name, setName] = useState('Order #1001');
  const [draft, setDraft] = useState(name);

  return (
    <div className="grid justify-items-center gap-4">
      <p className="type-body-md m-0">{name}</p>
      <Dialog.Root defaultOpen onOpenChange={(open) => open && setDraft(name)}>
        <Dialog.Trigger render={<Button variant="secondary" />}>
          Rename order
        </Dialog.Trigger>
        <Dialog.Popup title="Rename order">
          {({ close }) => (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setName(draft);
                close();
              }}
            >
              <Field label="Name" name="name">
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.currentTarget.value)}
                />
              </Field>
              <Dialog.Actions>
                <Dialog.Close>Cancel</Dialog.Close>
                <Button type="submit">Save</Button>
              </Dialog.Actions>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Root>
    </div>
  );
}

/** A form inside the dialog closes it on submit through the popup's `close`. */
export const WithForm = meta.story({
  render: () => <RenameOrder />,
});

function Controlled() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open from elsewhere
      </Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Popup
          title="Shipping details"
          description="Opened by the parent with `open`, without a trigger."
        >
          <Dialog.Actions>
            <Dialog.Close />
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Root>
    </>
  );
}

/** Controlled with `open`, without a trigger. */
export const ControlledWithoutTrigger = meta.story({
  render: () => <Controlled />,
});
