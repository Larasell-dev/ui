import preview from '../../../../.storybook/preview.tsx';
import { spacingScale } from '../spacing.ts';
import { Stack } from './stack.tsx';

const meta = preview.meta({
  title: 'Atoms/Layout/Stack',
  component: Stack,
  args: {
    spacing: 4 as const,
    children: (
      <>
        <Box>One</Box>
        <Box>Two</Box>
        <Box>Three</Box>
      </>
    ),
  },
  argTypes: {
    spacing: { control: 'select', options: spacingScale },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between'],
    },
    children: { control: false },
  },
  parameters: {
    layout: 'centered',
  },
});

export const Default = meta.story({});

export const Compact = meta.story({
  args: {
    spacing: 1,
  },
});

export const Spacious = meta.story({
  args: {
    spacing: 12,
  },
});

/** Centres children horizontally instead of stretching them. */
export const AlignCenter = meta.story({
  args: {
    align: 'center',
    children: (
      <>
        <Box>One</Box>
        <Box>Two, a little wider</Box>
        <Box>Three</Box>
      </>
    ),
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
});

/** Aligns children to the end of each row. */
export const AlignEnd = meta.story({
  args: { ...AlignCenter.input.args, align: 'end' },
  decorators: AlignCenter.input.decorators,
});

/** Centres children vertically in a stack taller than its content. */
export const JustifyCenter = meta.story({
  args: { justify: 'center' },
  decorators: [
    (Story) => <div className="flex h-80 w-40 [&>*]:flex-1">{Story()}</div>,
  ],
});

/** Pushes the first and last child to the top and bottom. */
export const JustifyBetween = meta.story({
  args: { justify: 'between' },
  decorators: JustifyCenter.input.decorators,
});

function Box({ children }: { children: string }) {
  return (
    <div className="bg-mauve-200 px-4 py-2 text-sm text-mauve-950">
      {children}
    </div>
  );
}
