import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import {
  AddLine,
  ArrowLeftLine,
  DeleteBinLine,
  Settings3Line,
} from '../../../icons.ts';
import { Icon } from '../../icon/icon.tsx';
import { Button } from '../button/button.tsx';
import { IconButton } from './icon-button.tsx';

const meta = preview.meta({
  title: 'Atoms/IconButton',
  component: IconButton,
  args: {
    children: <Icon icon={AddLine} />,
    'aria-label': 'Add',
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
  },
});

export const Primary = meta.story({});

export const Secondary = meta.story({
  args: {
    variant: 'secondary',
    children: <Icon icon={Settings3Line} />,
    'aria-label': 'Settings',
  },
});

export const Tertiary = meta.story({
  args: {
    variant: 'tertiary',
    children: <Icon icon={ArrowLeftLine} />,
    'aria-label': 'Back',
  },
});

export const Destructive = meta.story({
  args: {
    variant: 'destructive',
    children: <Icon icon={DeleteBinLine} />,
    'aria-label': 'Delete',
  },
});

export const Small = meta.story({
  args: { size: 'sm' },
});

export const Disabled = meta.story({
  args: { disabled: true },
});

/** Each size is as tall as a Button of the same size. */
export const BesideButton = meta.story({
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <IconButton {...args} size={size} />
          <Button size={size}>Save</Button>
        </div>
      ))}
    </div>
  ),
});
