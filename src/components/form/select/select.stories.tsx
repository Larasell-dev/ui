import ArrowDownSLine from '@iconify-icons/ri/arrow-down-s-line';
import { useState } from 'react';
import preview from '../../../../.storybook/preview.tsx';
import { Icon } from '../../icon/icon.tsx';
import { Button } from '../button/button.tsx';
import { Select } from './select.ts';

type Language = { code: string; name: string };
const languages: Language[] = [
  { code: 'de', name: 'German' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
];

type Channel = { channelId: number; channel: string; domain: string };
const channels: Channel[] = [
  { channelId: 1, channel: 'Webshop DE', domain: 'shop.example.de' },
  { channelId: 2, channel: 'Webshop CH', domain: 'shop.example.ch' },
  { channelId: 3, channel: 'B2B portal', domain: 'b2b.example.com' },
  { channelId: 4, channel: 'Marketplace', domain: 'market.example.com' },
];

const channelLabel = (count: number) =>
  count === channels.length
    ? 'All sales channels'
    : count === 1
      ? '1 sales channel'
      : `${count} sales channels`;

const meta = preview.meta({
  title: 'Atoms/Select',
  component: Select.Root,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 360 }}>
        <Story />
      </div>
    ),
  ],
});

/** One value: picking an item changes it and closes the list. */
export const Single = meta.story({
  render: function Render() {
    const [language, setLanguage] = useState<Language | null>(languages[0]!);
    return (
      <Select.Root
        items={languages}
        itemToKey={(l) => l.code}
        itemToLabel={(l) => l.name}
        value={language}
        onValueChange={setLanguage}
        filter={{
          placeholder: 'Search languages',
          empty: 'No language matches.',
        }}
      >
        <Select.Trigger aria-label="Content language" />
        <Select.Popup />
      </Select.Root>
    );
  },
});

/** Several values: picking toggles an item and keeps the list open. */
export const Multiple = meta.story({
  render: () => (
    <Select.Root
      multiple
      items={languages}
      itemToKey={(l) => l.code}
      itemToLabel={(l) => l.name}
      defaultValue={[languages[0]!, languages[2]!]}
    >
      <Select.Trigger aria-label="Languages" placeholder="Pick languages" />
      <Select.Popup />
    </Select.Root>
  ),
});

/** The sales channel filter: a button of your own, checkboxes, a search. */
export const CustomTrigger = meta.story({
  render: function Render() {
    const [shown, setShown] = useState(channels);
    return (
      <Select.Root
        multiple
        items={channels}
        itemToKey={(c) => c.channelId}
        itemToLabel={(c) => c.channel}
        value={shown}
        onValueChange={setShown}
        filter={{
          placeholder: 'Search sales channels',
          empty: 'No sales channel matches.',
        }}
      >
        <Select.Trigger render={<Button variant="secondary" />}>
          {(selected) => channelLabel(selected.length)}
          <Icon icon={ArrowDownSLine} />
        </Select.Trigger>
        <Select.Popup align="end">
          {(channel: Channel) => (
            <Select.Item item={channel}>
              <Select.ItemCheckbox />
              {channel.channel}
            </Select.Item>
          )}
        </Select.Popup>
      </Select.Root>
    );
  },
});

/** Items render what they're given; the label is what search matches. */
export const CustomItems = meta.story({
  render: () => (
    <Select.Root
      items={channels}
      itemToKey={(c) => c.channelId}
      itemToLabel={(c) => c.channel}
      filter={{ placeholder: 'Search sales channels' }}
    >
      <Select.Trigger aria-label="Sales channel" placeholder="Pick one" />
      <Select.Popup>
        {(channel: Channel) => (
          <Select.Item item={channel}>
            <span className="flex min-w-0 flex-1 flex-col">
              {channel.channel}
              <span className="type-label-sm text-base-tertiary">
                {channel.domain}
              </span>
            </span>
          </Select.Item>
        )}
      </Select.Popup>
    </Select.Root>
  ),
});
