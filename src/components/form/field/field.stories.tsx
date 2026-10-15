import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Field } from './field.tsx';

const meta = preview.meta({
  title: 'Molecules/Field',
  component: Field,
  args: {
    label: 'Email',
    name: 'email',
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
    <div className="w-64">
      <Field {...args} />
    </div>
  ),
});

export const Default = meta.story({});

export const Invalid = meta.story({
  args: {
    error: 'Enter an email address.',
  },
});

export const Required = meta.story({
  args: {
    required: true,
  },
});

export const Optional = meta.story({
  args: {
    required: 'optional',
  },
});

export const WithDescription = meta.story({
  args: {
    description: 'We will only use this to send the receipt.',
  },
});
