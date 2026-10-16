import preview from '../../../.storybook/preview.tsx';
import { Spinner } from './spinner.tsx';

const meta = preview.meta({
  title: 'Atoms/Spinner',
  component: Spinner,
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
