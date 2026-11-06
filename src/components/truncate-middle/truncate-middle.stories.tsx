import preview from '../../../.storybook/preview.tsx';
import { Tooltip } from '../tooltip/tooltip.ts';
import { TruncateMiddle } from './truncate-middle.tsx';

const meta = preview.meta({
  title: 'Atoms/TruncateMiddle',
  component: TruncateMiddle,
  args: {
    children: 'shop.example.com/collections/autumn-winter-2026/en/',
  },
  parameters: { layout: 'centered' },
  render: (args) => (
    <div className="border-base-strong w-48 border border-dashed">
      <TruncateMiddle {...args} />
    </div>
  ),
});

/** Too long for its box: the start and the end stay, the middle goes. */
export const Default = meta.story({});

/** Text that fits stays whole. */
export const Fits = meta.story({
  args: { children: 'shop.de/en/' },
});

/** Drag the box's corner: the text fits again as the box grows and shrinks. */
export const Resizable = meta.story({
  render: (args) => (
    <div className="border-base-strong w-80 resize-x overflow-hidden border border-dashed">
      <TruncateMiddle {...args} />
    </div>
  ),
});

/** Even a few pixels show the ellipsis and what fits around it. */
export const VeryNarrow = meta.story({
  render: (args) => (
    <div className="border-base-strong w-6 border border-dashed">
      <TruncateMiddle {...args} />
    </div>
  ),
});

/** One long word, and characters made of several code units, are cut whole. */
export const LongWordAndEmoji = meta.story({
  args: {
    children: '👟👟👟Donaudampfschifffahrtsgesellschaftskapitänsmütze👟👟👟',
  },
});

/** In a flex row it shrinks like any text, and grows to its text's width. */
export const InAFlexRow = meta.story({
  render: (args) => (
    <div className="border-base-strong flex w-96 gap-2 border border-dashed">
      <span className="shrink-0">Domain:</span>
      <TruncateMiddle {...args} />
      <span className="shrink-0">· Primary</span>
    </div>
  ),
});

/** With Tooltip.Truncated, hovering shows the whole text while it's cut. */
export const WithTooltip = meta.story({
  render: (args) => (
    <div className="w-48">
      <Tooltip.Truncated>
        <TruncateMiddle {...args} />
      </Tooltip.Truncated>
    </div>
  ),
});
