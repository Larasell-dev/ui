import preview from '../../../.storybook/preview.tsx';
import { spacingScale } from '../layout/spacing.ts';
import { Spinner } from './spinner.tsx';

const meta = preview.meta({
  title: 'Atoms/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: 'select',
      options: spacingScale,
      description:
        'Width and height on the Tailwind spacing scale, like the `size-*` utilities: `6` is `size-6`, 24px by default. Omit it (default) and the spinner is 1em square, so it matches the size of the surrounding text.',
    },
  },
  parameters: {
    layout: 'centered',
  },
});

export const Default = meta.story({});

export const WithLabel = meta.story({
  args: {
    'aria-label': 'Loading orders',
  },
});

export const Sized = meta.story({
  args: {
    size: 6,
  },
});

export const InheritsFontSize = meta.story({
  render: () => (
    <span style={{ fontSize: 48 }}>
      <Spinner />
    </span>
  ),
});

export const InheritsColor = meta.story({
  render: () => (
    <span className="text-red-600">
      <Spinner />
    </span>
  ),
});
