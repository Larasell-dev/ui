import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Field } from '../field/field.tsx';
import { Textarea } from './textarea.tsx';

const meta = preview.meta({
  title: 'Atoms/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Tools for every workshop.',
    onInput: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
});

export const Default = meta.story({});

export const LongText = meta.story({
  args: {
    defaultValue: Array.from(
      { length: 14 },
      (_, line) => `Line ${line + 1}`,
    ).join('\n'),
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const InField = meta.story({
  render: (args) => (
    <div className="w-80">
      <Field
        label="Description"
        name="description"
        error="The description is too long."
      >
        <Textarea {...args} name="description" />
      </Field>
    </div>
  ),
});
