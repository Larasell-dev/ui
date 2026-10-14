import preview from '../../../../.storybook/preview.tsx';
import { Button } from './button.tsx';

const meta = preview.meta({
  title: 'Button',
  component: Button,
  args: {
    children: 'Save',
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
