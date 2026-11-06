import { useState, type FormEvent } from 'react';
import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Button } from '../button/button.tsx';
import { Field } from '../field/field.tsx';
import { TagCombobox } from './tag-combobox.ts';

// Every currency the browser knows, named in English: about 300 items.
const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });
const allCurrencies = Intl.supportedValuesOf('currency').map((code) => ({
  code,
  name: currencyNames.of(code) ?? code,
}));

const currencies = allCurrencies.filter((currency) =>
  ['CHF', 'EUR', 'GBP', 'JPY', 'SEK', 'USD'].includes(currency.code),
);

const meta = preview.meta({
  title: 'Atoms/TagCombobox',
  component: TagCombobox.Root,
  args: {
    onValueChange: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      // Room for the list below the box.
      <div className="w-96" style={{ minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
});

/**
 * In a `Field`, like every other control: the field names and labels it. The
 * options come as `items`.
 */
export const Default = meta.story({
  render: (args) => (
    <Field label="Languages" name="locales">
      <TagCombobox.Root
        {...args}
        placeholder="Search languages"
        items={[
          { value: 'de', label: 'German' },
          { value: 'en', label: 'English' },
          { value: 'fr', label: 'French' },
          { value: 'it', label: 'Italian' },
          { value: 'nl', label: 'Dutch' },
        ]}
      />
    </Field>
  ),
});

/**
 * `TagCombobox.Item`s render what they're given, e.g. the code less
 * prominent than the name. The `label` is what typing matches and screen
 * readers read.
 */
export const RichItems = meta.story({
  render: (args) => (
    <Field label="Currencies" name="currencies">
      <TagCombobox.Root {...args} defaultValue={['EUR', 'USD']}>
        {currencies.map(({ code, name }) => (
          <TagCombobox.Item key={code} value={code} label={`${name} (${code})`}>
            {name} <span className="text-base-tertiary">{code}</span>
          </TagCombobox.Item>
        ))}
      </TagCombobox.Root>
    </Field>
  ),
});

/** Long labels wrap in the list and are cut short in their tags. */
export const LongLabels = meta.story({
  render: (args) => (
    <Field label="Collections" name="collections">
      <TagCombobox.Root {...args} defaultValue={['long', 'word']}>
        <TagCombobox.Item value="short">Sale</TagCombobox.Item>
        <TagCombobox.Item value="long">
          Autumn and winter outerwear for every weather, from light rain jackets
          to heavy down parkas, in all sizes and colours
        </TagCombobox.Item>
        <TagCombobox.Item value="word">
          Donaudampfschifffahrtsgesellschaftskapitänsmützenkollektion
        </TagCombobox.Item>
        <TagCombobox.Item value="url">
          https://example.com/collections/autumn-winter-outerwear-2026-limited-edition
        </TagCombobox.Item>
      </TagCombobox.Root>
    </Field>
  ),
});

/** Hundreds of items: the list scrolls, and typing narrows it down. */
export const ManyItems = meta.story({
  render: (args) => (
    <Field label="Currencies" name="currencies">
      <TagCombobox.Root {...args} placeholder="Search currencies">
        {allCurrencies.map(({ code, name }) => (
          <TagCombobox.Item key={code} value={code} label={`${name} (${code})`}>
            {name} <span className="text-base-tertiary">{code}</span>
          </TagCombobox.Item>
        ))}
      </TagCombobox.Root>
    </Field>
  ),
});

/** Every item picked: the box grows with its tags. */
export const ManyPicked = meta.story({
  render: (args) => (
    <Field label="Currencies" name="currencies">
      <TagCombobox.Root
        {...args}
        defaultValue={allCurrencies.map((currency) => currency.code)}
      >
        {allCurrencies.map(({ code, name }) => (
          <TagCombobox.Item key={code} value={code} label={`${name} (${code})`}>
            {code}
          </TagCombobox.Item>
        ))}
      </TagCombobox.Root>
    </Field>
  ),
});

/** In a narrow column, tags wrap and long ones are cut short. */
export const Narrow = meta.story({
  render: (args) => (
    <div className="w-48">
      <Field label="Currencies" name="currencies">
        <TagCombobox.Root {...args} defaultValue={['CHF', 'GBP', 'SEK']}>
          {currencies.map(({ code, name }) => (
            <TagCombobox.Item
              key={code}
              value={code}
              label={`${name} (${code})`}
            >
              {name} <span className="text-base-tertiary">{code}</span>
            </TagCombobox.Item>
          ))}
        </TagCombobox.Root>
      </Field>
    </div>
  ),
});

/** No items at all: the list says so. */
export const NoItems = meta.story({
  render: (args) => (
    <Field label="Tags" name="tags">
      <TagCombobox.Root {...args} empty="No tags yet" />
    </Field>
  ),
});

export const WithError = meta.story({
  render: (args) => (
    <Field
      label="Currencies"
      name="currencies"
      error="Pick at least one currency."
    >
      <TagCombobox.Root {...args}>
        {currencies.map(({ code, name }) => (
          <TagCombobox.Item key={code} value={code} label={`${name} (${code})`}>
            {name} <span className="text-base-tertiary">{code}</span>
          </TagCombobox.Item>
        ))}
      </TagCombobox.Root>
    </Field>
  ),
});

export const Disabled = meta.story({
  render: (args) => (
    <Field label="Currencies" name="currencies">
      <TagCombobox.Root {...args} disabled defaultValue={['EUR']}>
        {currencies.map(({ code, name }) => (
          <TagCombobox.Item key={code} value={code} label={`${name} (${code})`}>
            {name} <span className="text-base-tertiary">{code}</span>
          </TagCombobox.Item>
        ))}
      </TagCombobox.Root>
    </Field>
  ),
});

/** Disabled items show but can't be picked. */
export const DisabledItems = meta.story({
  render: (args) => (
    <Field label="Languages" name="locales">
      <TagCombobox.Root {...args}>
        <TagCombobox.Item value="de">German</TagCombobox.Item>
        <TagCombobox.Item value="en" disabled>
          English (needs the Pro plan)
        </TagCombobox.Item>
        <TagCombobox.Item value="fr">French</TagCombobox.Item>
      </TagCombobox.Root>
    </Field>
  ),
});

/** With `value` and `onValueChange`, the page holds the picked items. */
export const Controlled = meta.story({
  render: function Render(args) {
    const [value, setValue] = useState(['EUR']);

    return (
      <div className="flex flex-col items-start gap-3">
        <Field label="Currencies" name="currencies">
          <TagCombobox.Root
            {...args}
            value={value}
            onValueChange={(next) => {
              setValue(next);
              args.onValueChange?.(next);
            }}
          >
            {currencies.map(({ code, name }) => (
              <TagCombobox.Item
                key={code}
                value={code}
                label={`${name} (${code})`}
              >
                {name} <span className="text-base-tertiary">{code}</span>
              </TagCombobox.Item>
            ))}
          </TagCombobox.Root>
        </Field>
        <Button variant="secondary" onClick={() => setValue([])}>
          Clear
        </Button>
        <code className="type-body-sm">{JSON.stringify(value)}</code>
      </div>
    );
  },
});

/**
 * In a form, the picked items submit as `currencies[]`, and a reset restores
 * them, without any state of the page's.
 */
export const InAForm = meta.story({
  render: function Render(args) {
    const [submitted, setSubmitted] = useState<string>();
    const submit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitted(
        JSON.stringify([...new FormData(event.currentTarget).entries()]),
      );
    };

    return (
      <form onSubmit={submit} className="flex flex-col items-start gap-3">
        <Field label="Currencies" name="currencies">
          <TagCombobox.Root {...args} defaultValue={['USD']}>
            {currencies.map(({ code, name }) => (
              <TagCombobox.Item
                key={code}
                value={code}
                label={`${name} (${code})`}
              >
                {name} <span className="text-base-tertiary">{code}</span>
              </TagCombobox.Item>
            ))}
          </TagCombobox.Root>
        </Field>
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
        {submitted && <code className="type-body-sm">{submitted}</code>}
      </form>
    );
  },
});
