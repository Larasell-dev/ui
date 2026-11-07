import ArrowDownSLine from '@iconify-icons/ri/arrow-down-s-line';
import { useState } from 'react';
import { expect, screen, waitFor } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Icon } from '../../icon/icon.tsx';
import { Button } from '../button/button.tsx';
import { Field } from '../field/field.tsx';
import { Input } from '../input/input.tsx';
import { Select } from './select.tsx';

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
  component: Select,
  parameters: { layout: 'centered' },
  // Opens the list, so the screenshots show it rather than just the trigger.
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'));
    // The list renders in a portal, outside the story's canvas, and fades in
    // from opacity 0, which counts as hidden until the fade starts.
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible());
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 360 }}>
        <Story />
      </div>
    ),
  ],
});

/** The simple select: looks like an input, one value. */
export const Single = meta.story({
  render: function Render() {
    const [language, setLanguage] = useState<string | null>('de');
    return (
      <div style={{ width: 280 }}>
        <Select
          aria-label="Content language"
          items={languages}
          itemToKey={(l) => l.code}
          itemToLabel={(l) => l.name}
          value={language}
          onValueChange={setLanguage}
          filter={{
            placeholder: 'Search languages',
            empty: 'No language matches.',
          }}
        />
      </div>
    );
  },
});

/** Several values: picking toggles an item, shows a checkbox, keeps the list open. */
export const Multiple = meta.story({
  render: () => (
    <div style={{ width: 280 }}>
      <Select
        multiple
        aria-label="Languages"
        placeholder="Pick languages"
        items={languages}
        itemToKey={(l) => l.code}
        itemToLabel={(l) => l.name}
        defaultValue={['de', 'fr']}
      />
    </div>
  ),
});

/** The sales channel filter: a button of your own and a search, no form. */
export const CustomTrigger = meta.story({
  render: function Render() {
    const [shown, setShown] = useState(
      channels.map((c) => String(c.channelId)),
    );
    return (
      <Select.Root
        multiple
        items={channels}
        itemToKey={(c) => String(c.channelId)}
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
        <Select.Popup align="end" />
      </Select.Root>
    );
  },
});

/** Items render what they're given; the label is what search matches. */
export const CustomItems = meta.story({
  render: () => (
    <div style={{ width: 280 }}>
      <Select
        aria-label="Sales channel"
        placeholder="Pick one"
        items={channels}
        itemToKey={(c) => String(c.channelId)}
        itemToLabel={(c) => c.channel}
        filter={{ placeholder: 'Search sales channels' }}
        renderItem={(channel) => (
          <span className="flex min-w-0 flex-1 flex-col">
            {channel.channel}
            <span className="type-label-sm text-base-tertiary">
              {channel.domain}
            </span>
          </span>
        )}
      />
    </div>
  ),
});

/** In a field: the field's label names it, its error marks it invalid. */
export const InField = meta.story({
  render: () => (
    <div style={{ width: 320 }}>
      <Field
        label="Sells in"
        name="locales"
        error="Pick at least one language."
      >
        <Select
          multiple
          placeholder="None picked"
          items={languages}
          itemToKey={(l) => l.code}
          itemToLabel={(l) => l.name}
        />
      </Field>
      <div style={{ height: 16 }} />
      <Field label="Name" name="name">
        <Input defaultValue="Swiss Shop" />
      </Field>
    </div>
  ),
});
