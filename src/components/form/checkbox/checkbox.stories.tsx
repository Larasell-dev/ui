import { Field as BaseField } from '@base-ui/react/field';
import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Error } from '../error/error.tsx';
import { Checkbox } from './checkbox.ts';

const meta = preview.meta({
  title: 'Atoms/Checkbox',
  component: Checkbox.Indicator,
  args: {
    onCheckedChange: fn(),
  },
  argTypes: {
    DANGEROUS_className: { control: false },
    DANGEROUS_style: { control: false },
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <BaseField.Root>
      <Checkbox.Label>
        <Checkbox.Indicator {...args} />
        Visible in the store
      </Checkbox.Label>
    </BaseField.Root>
  ),
});

export const Unchecked = meta.story({});

export const Checked = meta.story({
  args: {
    defaultChecked: true,
  },
});

// Without a visible label it still needs an accessible name, such as in a table row.
export const WithoutLabel = meta.story({
  args: {
    'aria-label': 'Select row',
  },
  render: (args) => <Checkbox.Indicator {...args} />,
});

export const Indeterminate = meta.story({
  args: {
    indeterminate: true,
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const DisabledChecked = meta.story({
  args: {
    disabled: true,
    defaultChecked: true,
  },
});

export const Invalid = meta.story({
  render: (args) => (
    <BaseField.Root invalid className="flex flex-col gap-1.5">
      <Checkbox.Label>
        <Checkbox.Indicator {...args} />
        Accept the terms
      </Checkbox.Label>
      <Error match>Accept the terms to continue.</Error>
    </BaseField.Root>
  ),
});
