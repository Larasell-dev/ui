import { Field } from '@base-ui/react/field';
import preview from '../../../../.storybook/preview.tsx';
import { Error } from './error.tsx';

const meta = preview.meta({
  title: 'Atoms/Error',
  component: Error,
  args: {
    match: true,
    children: 'Enter an email address.',
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <Field.Root invalid>
      <Error {...args} />
    </Field.Root>
  ),
});

export const Default = meta.story({});

export const Wrapping = meta.story({
  args: {
    children:
      'Enter a valid email address so we can send the receipt and shipping updates to the right person.',
    match: true,
  },
  render: (args) => (
    <div className="w-48">
      <Field.Root invalid>
        <Error {...args} />
      </Field.Root>
    </div>
  ),
});
