import { Field } from '@base-ui/react/field';
import preview from '../../../../.storybook/preview.tsx';
import { Label } from './label.tsx';

const meta = preview.meta({
  title: 'Atoms/Label',
  component: Label,
  args: {
    children: 'Email',
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <Field.Root>
      <Label {...args} />
    </Field.Root>
  ),
});

export const Default = meta.story({});

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
