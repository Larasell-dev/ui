import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Input } from './input.tsx';
import { Button } from '../button/button.tsx';

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

export const WithButton = meta.story({
  render: (args) => (
    <div className="flex items-end gap-2">
      <Input {...args} />
      <Button>Subscribe</Button>
    </div>
  ),
});
