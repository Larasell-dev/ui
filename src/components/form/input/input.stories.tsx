import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Input } from './input.tsx';
import { Button } from '../button/button.tsx';
import { Field } from '../field/field.tsx';
import { Icon } from '../../icon/icon.tsx';
import { FileCopyLine, SearchLine } from '../../../icons.ts';

const meta = preview.meta({
  title: 'Atoms/Input',
  component: Input,
  args: {
    placeholder: 'ada@example.com',
    onChange: fn(),
    onInput: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onKeyDown: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
});

export const Default = meta.story({});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const WithButton = meta.story({
  render: (args) => (
    <div className="flex w-96 items-end gap-2">
      <Input {...args} />
      <Button>Subscribe</Button>
    </div>
  ),
});

export const WithPrefix = meta.story({
  args: {
    'aria-label': 'Search',
    placeholder: 'Search orders',
    prefix: <Icon icon={SearchLine} />,
  },
});

export const WithSuffix = meta.story({
  args: {
    'aria-label': 'Weight',
    placeholder: '0',
    inputMode: 'decimal',
    suffix: <span className="text-mauve-500">kg</span>,
  },
});

export const WithPrefixAndSuffix = meta.story({
  args: {
    'aria-label': 'Shop address',
    placeholder: 'my-shop',
    prefix: <span className="text-mauve-500">https://</span>,
    suffix: <span className="text-mauve-500">.larasell.shop</span>,
  },
});

export const WithButtonSuffix = meta.story({
  args: {
    'aria-label': 'API key',
    defaultValue: 'example-api-key-1234567890abcdef',
    readOnly: true,
    suffix: (
      <button
        type="button"
        aria-label="Copy"
        className="focus-visible:focus-ring -mr-3.5 inline-flex w-11 cursor-pointer items-center justify-center self-stretch hover:bg-mauve-100 focus-visible:outline-offset-0 dark:hover:bg-mauve-800"
      >
        <Icon icon={FileCopyLine} />
      </button>
    ),
  },
});

// Focused through the input, so the outline shows on the box around the affixes.
export const FocusedWithAffixes = meta.story({
  args: WithPrefixAndSuffix.input.args,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('textbox'));
  },
});

export const DisabledWithAffixes = meta.story({
  args: { ...WithPrefixAndSuffix.input.args, disabled: true },
});

export const InvalidWithAffixes = meta.story({
  args: { ...WithPrefixAndSuffix.input.args, 'aria-label': undefined },
  render: (args) => (
    <div className="w-80">
      <Field label="Shop address" name="shop" error="This address is taken.">
        <Input {...args} />
      </Field>
    </div>
  ),
});

// The text fades on the side it overflows; the prefix and suffix stay solid.
export const OverflowingWithAffixes = meta.story({
  args: {
    ...WithPrefixAndSuffix.input.args,
    defaultValue: 'a-shop-name-that-is-much-too-long-to-fit',
  },
});
