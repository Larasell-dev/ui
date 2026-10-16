import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Button } from './button.tsx';

const meta = preview.meta({
  title: 'Atoms/Button',
  component: Button,
  args: {
    children: 'Save',
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onKeyDown: fn(),
    onPointerDown: fn(),
  },
  parameters: {
    layout: 'centered',
  },
});

export const Primary = meta.story({});

export const Secondary = meta.story({
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
});

export const Tertiary = meta.story({
  args: {
    variant: 'tertiary',
    children: 'Skip',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const FullWidth = meta.story({
  args: {
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
});

export const Loading = meta.story({
  args: {
    loading: true,
    children: 'Saving…',
  },
});
