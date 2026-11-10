import { useState } from 'react';
import { Button } from '../form/button/button.tsx';
import { Field } from '../form/field/field.tsx';
import { Input } from '../form/input/input.tsx';
import preview from '../../../.storybook/preview.tsx';
import { Slideover } from './slideover.ts';

const meta = preview.meta({
  title: 'Molecules/Slideover',
  component: Slideover.Root,
});

function AddAddress({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add address</Button>
      <Slideover.Root open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <Slideover.Header
            title="Add address"
            description="Where the customer receives orders or invoices."
          />
          <Slideover.Content>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" name="first_name">
                  <Input />
                </Field>
                <Field label="Last name" name="last_name">
                  <Input />
                </Field>
              </div>
              <Field label="Street" name="street">
                <Input />
              </Field>
            </div>
          </Slideover.Content>
          <Slideover.Footer>
            <Slideover.Actions>
              <Slideover.Close />
              <Button type="submit">Add address</Button>
            </Slideover.Actions>
          </Slideover.Footer>
        </form>
      </Slideover.Root>
    </>
  );
}

/** A form in a slideover; the footer stays at the bottom while the content scrolls. */
export const WithForm = meta.story({ render: () => <AddAddress /> });

/** Open on load, to review the panel on its own. */
export const Open = meta.story({ render: () => <AddAddress defaultOpen /> });
