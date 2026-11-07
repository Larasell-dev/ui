import { useState } from 'react';
import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Field } from '../field/field.tsx';
import { Select } from './select.tsx';

type Channel = { id: string; name: string };

const channels: Channel[] = [
  { id: '1', name: 'Webshop DE' },
  { id: '2', name: 'Webshop CH' },
  { id: '3', name: 'B2B portal' },
];

const channelProps = {
  items: channels,
  itemToKey: (c: Channel) => c.id,
  itemToLabel: (c: Channel) => c.name,
};

test('single: picking an item reports its key and closes the list', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <Select
      {...channelProps}
      aria-label="Channel"
      defaultValue="1"
      onValueChange={onValueChange}
    />,
  );
  const trigger = screen.getByRole('combobox', { name: 'Channel' });
  await expect.element(trigger).toHaveTextContent('Webshop DE');

  await trigger.click();
  await screen.getByRole('option', { name: 'B2B portal' }).click();

  expect(onValueChange).toHaveBeenLastCalledWith('3');
  await expect.element(screen.getByRole('listbox')).not.toBeInTheDocument();
  await expect.element(trigger).toHaveTextContent('B2B portal');
});

function ChannelFilter() {
  const [shown, setShown] = useState(['1', '2', '3']);
  return (
    <Select.Root
      multiple
      {...channelProps}
      value={shown}
      onValueChange={setShown}
      filter={{ placeholder: 'Search', empty: 'No match.' }}
    >
      <Select.Trigger render={<button type="button" />}>
        {(selected) => `${selected.length} channels`}
      </Select.Trigger>
      <Select.Popup />
    </Select.Root>
  );
}

test('multiple: picking toggles an item, keeps the list open, and shows checkboxes', async () => {
  const screen = await render(<ChannelFilter />);
  await screen.getByRole('combobox', { name: '3 channels' }).click();

  for (const channel of channels) {
    await screen.getByRole('option', { name: channel.name }).click();
  }

  await expect.element(screen.getByRole('listbox')).toBeVisible();
  await expect
    .element(screen.getByRole('combobox', { name: '0 channels' }))
    .toBeInTheDocument();
  await expect
    .element(
      screen
        .getByRole('option', { name: 'Webshop CH' })
        .getByTestId('select-item-checkbox'),
    )
    .toBeInTheDocument();
});

test('multiple: picking an item keeps the search', async () => {
  // Arrange
  const screen = await render(<ChannelFilter />);
  await screen.getByRole('combobox', { name: '3 channels' }).click();
  await screen.getByPlaceholder('Search').fill('webshop');
  await expect
    .element(screen.getByRole('option', { name: 'B2B portal' }))
    .not.toBeInTheDocument();

  // Act
  await screen.getByRole('option', { name: 'Webshop CH' }).click();

  // Assert
  await expect
    .element(screen.getByPlaceholder('Search'))
    .toHaveValue('webshop');
  await expect
    .element(screen.getByRole('option', { name: 'B2B portal' }))
    .not.toBeInTheDocument();
});

test('filters the items by their label, and shows the empty text when none match', async () => {
  const screen = await render(<ChannelFilter />);
  await screen.getByRole('combobox', { name: '3 channels' }).click();

  await userEvent.keyboard('webshop');
  await expect
    .element(screen.getByRole('option', { name: 'B2B portal' }))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole('option', { name: 'Webshop CH' }))
    .toBeVisible();

  await userEvent.keyboard('xyz');
  await expect.element(screen.getByText('No match.')).toBeVisible();
});

test('submits the picked keys under the field name, as name[] with multiple', async () => {
  const screen = await render(
    <form aria-label="Channel form">
      <Field label="Channels" name="channels">
        <Select multiple {...channelProps} defaultValue={['2']} />
      </Field>
      <Field label="Main channel" name="main">
        <Select {...channelProps} defaultValue="3" />
      </Field>
    </form>,
  );
  const form = screen.getByRole('form').element() as HTMLFormElement;

  await screen.getByRole('combobox', { name: 'Channels' }).click();
  await screen.getByRole('option', { name: 'Webshop DE' }).click();

  await expect
    .poll(() => [...new FormData(form)].map(([k, v]) => `${k}=${v as string}`))
    .toEqual(['channels[]=1', 'channels[]=2', 'main=3']);
});

test('tells the form when picking, and reads the value back on reset', async () => {
  const onInput = vi.fn();
  const screen = await render(
    <form aria-label="Channel form" onInput={onInput}>
      <Field label="Main channel" name="main">
        <Select {...channelProps} defaultValue="1" />
      </Field>
    </form>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Main channel' });
  await trigger.click();
  await screen.getByRole('option', { name: 'B2B portal' }).click();
  await expect.poll(() => onInput.mock.calls.length).toBeGreaterThan(0);

  (screen.getByRole('form').element() as HTMLFormElement).reset();

  await expect.element(trigger).toHaveTextContent('Webshop DE');
});

test('without a name, renders no form inputs', async () => {
  const screen = await render(
    <form aria-label="Channel form">
      <Select {...channelProps} aria-label="Channel" defaultValue="1" />
    </form>,
  );
  const form = screen.getByRole('form').element() as HTMLFormElement;
  expect([...new FormData(form)]).toEqual([]);
});

test('drops keys that match no item', async () => {
  const screen = await render(
    <Select
      {...channelProps}
      aria-label="Channel"
      placeholder="Pick one"
      defaultValue="99"
    />,
  );
  await expect
    .element(screen.getByRole('combobox', { name: 'Channel' }))
    .toHaveTextContent('Pick one');
});

test('applies DANGEROUS_className to input, popup and items', async () => {
  const screen = await render(
    <Select.Root {...channelProps}>
      <Select.Input aria-label="Channel" DANGEROUS_className="mt-4" />
      <Select.Popup DANGEROUS_className="w-80">
        {(c: Channel) => <Select.Item item={c} DANGEROUS_className="italic" />}
      </Select.Popup>
    </Select.Root>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Channel' });
  await expect.element(trigger).toHaveClass('mt-4');
  await trigger.click();
  await expect
    .element(screen.getByRole('option', { name: 'Webshop DE' }))
    .toHaveClass('italic');
});
