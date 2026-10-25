import preview from '../../../.storybook/preview.tsx';
import { Badge } from './badge.tsx';

const meta = preview.meta({
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Draft' },
  parameters: { layout: 'centered' },
});

export const Neutral = meta.story({});

export const Info = meta.story({
  args: { variant: 'info', children: 'Shipped' },
});

export const Success = meta.story({
  args: { variant: 'success', children: 'Paid' },
});

export const Warning = meta.story({
  args: { variant: 'warning', children: 'Awaiting payment' },
});

export const Danger = meta.story({
  args: { variant: 'danger', children: 'Refunded' },
});
