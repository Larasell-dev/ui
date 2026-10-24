import { fn } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Field } from '../field/field.tsx';
import { PasswordInput } from './password-input.tsx';

const meta = preview.meta({
  title: 'Atoms/PasswordInput',
  component: PasswordInput,
  args: {
    'aria-label': 'Password',
    placeholder: 'Enter your password',
    onChange: fn(),
    onInput: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onKeyDown: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div className="w-64">
      <PasswordInput {...args} />
    </div>
  ),
});

export const Default = meta.story({});

export const WithValue = meta.story({
  args: {
    defaultValue: 'correct horse battery staple',
  },
});

export const Visible = meta.story({
  args: {
    defaultValue: 'correct horse battery staple',
  },
  // The visible state is internal, so the story reaches it the way a user would.
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show password' }),
    );
  },
});

export const Disabled = meta.story({
  args: {
    defaultValue: 'correct horse battery staple',
    disabled: true,
  },
});

export const InField = meta.story({
  args: {
    'aria-label': undefined,
    autoComplete: 'current-password',
  },
  render: (args) => (
    <div className="w-64">
      <Field label="Password" name="password" required>
        <PasswordInput {...args} />
      </Field>
    </div>
  ),
});

export const Invalid = meta.story({
  args: {
    'aria-label': undefined,
    autoComplete: 'new-password',
    defaultValue: 'short',
  },
  render: (args) => (
    <div className="w-64">
      <Field
        label="New password"
        name="password"
        error="Use at least 12 characters."
      >
        <PasswordInput {...args} />
      </Field>
    </div>
  ),
});
