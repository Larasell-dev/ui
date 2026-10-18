import preview from '../../../../.storybook/preview.tsx';
import { spacingScale } from '../spacing.ts';
import { Inline } from './inline.tsx';

const meta = preview.meta({
  title: 'Atoms/Layout/Inline',
  component: Inline,
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

/** Centres children of different heights vertically. */
export const AlignCenter = meta.story({
  args: {
    align: 'center',
    children: (
      <>
        <Box>One</Box>
        <TallBox>Two</TallBox>
        <Box>Three</Box>
      </>
    ),
  },
});

/** Lines up the text of children with different heights. */
export const AlignBaseline = meta.story({
  args: { ...AlignCenter.input.args, align: 'baseline' },
});

/** Centres children horizontally in a row wider than its content. */
export const JustifyCenter = meta.story({
  args: { justify: 'center' },
  decorators: [
    (Story) => <div className="flex w-[32rem] [&>*]:flex-1">{Story()}</div>,
  ],
});

/** Pushes the first and last child to both ends. */
export const JustifyBetween = meta.story({
  args: { justify: 'between' },
  decorators: JustifyCenter.input.decorators,
});

function TallBox({ children }: { children: string }) {
  return (
    <div className="bg-mauve-200 px-4 py-6 text-sm text-mauve-950">
      {children}
    </div>
  );
}

function Box({ children }: { children: string }) {
  return (
    <div className="bg-mauve-200 px-4 py-2 text-sm text-mauve-950">
      {children}
    </div>
  );
}
