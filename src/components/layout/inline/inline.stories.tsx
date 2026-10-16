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

function Box({ children }: { children: string }) {
  return (
    <div className="bg-mauve-200 px-4 py-2 text-sm text-mauve-950">
      {children}
    </div>
  );
}
