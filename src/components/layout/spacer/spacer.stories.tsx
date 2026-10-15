import preview from '../../../../.storybook/preview.tsx';
import { spacingScale } from '../spacing.ts';
import { Spacer } from './spacer.tsx';

const meta = preview.meta({
  title: 'Atoms/Layout/Spacer',
  component: Spacer,
  args: {
    spacing: 4 as const,
  },
  argTypes: {
    spacing: { control: 'select', options: spacingScale },
    axis: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
  },
  parameters: {
    layout: 'centered',
  },
});

export const Vertical = meta.story({
  render: (args) => (
    <div>
      <Box>Above</Box>
      <Spacer {...args} />
      <Box>Below</Box>
    </div>
  ),
});

export const Horizontal = meta.story({
  args: {
    axis: 'horizontal',
  },
  render: (args) => (
    <div className="flex">
      <Box>Before</Box>
      <Spacer {...args} />
      <Box>After</Box>
    </div>
  ),
});

function Box({ children }: { children: string }) {
  return (
    <div className="bg-mauve-200 px-4 py-2 text-sm text-mauve-950">
      {children}
    </div>
  );
}
