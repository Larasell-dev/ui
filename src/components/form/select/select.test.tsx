import { useState } from 'react';
import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Select } from './select.ts';

type Channel = { id: number; name: string };
const channels: Channel[] = [
  { id: 1, name: 'Webshop DE' },
  { id: 2, name: 'Webshop CH' },
  { id: 3, name: 'B2B portal' },
];

test('single: picking an item changes the value and closes the list', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <Select.Root
      items={channels}
      itemToKey={(c) => c.id}
      itemToLabel={(c) => c.name}
      defaultValue={channels[0]}
      onValueChange={onValueChange}
    >
      <Select.Trigger aria-label="Channel" />
      <Select.Popup />
    </Select.Root>,
  );

  const trigger = screen.getByRole('combobox', { name: 'Channel' });
  await expect.element(trigger).toHaveTextContent('Webshop DE');
  await trigger.click();
  await screen.getByRole('option', { name: 'B2B portal' }).click();

  expect(onValueChange).toHaveBeenLastCalledWith(channels[2]);
  await expect.element(screen.getByRole('listbox')).not.toBeInTheDocument();
  await expect.element(trigger).toHaveTextContent('B2B portal');
});

function ChannelFilter({ onSearch }: { onSearch?: (q: string) => void }) {
  const [shown, setShown] = useState(channels);
  return (
    <Select.Root
      multiple
      items={channels}
      itemToKey={(c) => c.id}
      itemToLabel={(c) => c.name}
      value={shown}
      onValueChange={setShown}
      filter={{ placeholder: 'Search', empty: 'No match.', onSearch }}
    >
      <Select.Trigger render={<button type="button" />}>
        {(selected) => `${selected.length} channels`}
        <span aria-hidden>▾</span>
      </Select.Trigger>
      <Select.Popup>
        {(channel: Channel) => (
          <Select.Item item={channel}>
            <Select.ItemCheckbox />
            <span data-testid="name">{channel.name}</span>
          </Select.Item>
        )}
      </Select.Popup>
    </Select.Root>
  );
}

test('multiple: picking toggles an item, keeps the list open, and allows none', async () => {
  const screen = await render(<ChannelFilter />);

  await screen.getByRole('combobox', { name: '3 channels' }).click();
  for (const channel of channels) {
    await screen.getByRole('option', { name: channel.name }).click();
  }

  await expect.element(screen.getByRole('listbox')).toBeVisible();
  await expect
    .element(screen.getByRole('combobox', { name: '0 channels' }))
    .toBeInTheDocument();
  await screen.getByRole('option', { name: 'Webshop CH' }).click();
  await expect
    .element(screen.getByRole('option', { name: 'Webshop CH' }))
    .toHaveAttribute('aria-selected', 'true');
  await expect
    .element(
      screen
        .getByRole('option', { name: 'Webshop CH' })
        .getByTestId('select-item-checkbox'),
    )
    .toBeInTheDocument();
});

test('filters the items by their label, and hides the list when none match', async () => {
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
  await expect.element(screen.getByRole('listbox')).not.toBeVisible();
});

test('with onSearch, reports the query and shows the items as given', async () => {
  const onSearch = vi.fn();
  const screen = await render(<ChannelFilter onSearch={onSearch} />);

  await screen.getByRole('combobox', { name: '3 channels' }).click();
  await userEvent.keyboard('xyz');

  expect(onSearch).toHaveBeenLastCalledWith('xyz');
  await expect
    .element(screen.getByRole('option', { name: 'B2B portal' }))
    .toBeVisible();
});

test('without a filter, shows no search field and keys through the items', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <Select.Root
      items={channels}
      itemToKey={(c) => c.id}
      itemToLabel={(c) => c.name}
      onValueChange={onValueChange}
    >
      <Select.Trigger aria-label="Channel" placeholder="Pick one" />
      <Select.Popup />
    </Select.Root>,
  );

  await screen.getByRole('combobox', { name: 'Channel' }).click();
  await expect.element(screen.getByRole('listbox')).toBeVisible();
  expect(screen.getByPlaceholder('Search').elements()).toHaveLength(0);
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(onValueChange).toHaveBeenCalled();
});

test('applies DANGEROUS_className to trigger, popup and items', async () => {
  const screen = await render(
    <Select.Root
      items={channels}
      itemToKey={(c) => c.id}
      itemToLabel={(c) => c.name}
    >
      <Select.Trigger aria-label="Channel" DANGEROUS_className="mt-4" />
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
