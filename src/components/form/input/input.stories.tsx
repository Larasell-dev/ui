import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Input } from './input.tsx';

const meta = preview.meta({
  title: 'Atoms/Input',
  component: Input,
  args: {
    placeholder: 'ada@example.com',
    onChange: fn(),
    onInput: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onKeyDown: fn(),
  },
  parameters: {
    layout: 'centered',
  },
});

export const Default = meta.story({});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});
