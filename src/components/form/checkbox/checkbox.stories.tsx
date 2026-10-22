import { Field as BaseField } from '@base-ui/react/field';
import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Error } from '../error/error.tsx';
import { Label } from '../label/label.tsx';
import { Checkbox } from './checkbox.tsx';

const meta = preview.meta({
  title: 'Atoms/Checkbox',
  component: Checkbox,
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
      <Label DANGEROUS_className="flex items-center gap-2.5">
        <Checkbox {...args} />
        Visible in the store
      </Label>
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
  render: (args) => <Checkbox {...args} />,
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
      <Label DANGEROUS_className="flex items-center gap-2.5">
        <Checkbox {...args} />
        Accept the terms
      </Label>
      <Error match>Accept the terms to continue.</Error>
    </BaseField.Root>
  ),
});
