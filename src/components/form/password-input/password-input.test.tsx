import { expect, test, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { PasswordInput } from './password-input.tsx';

test('hides the value by default', async () => {
  const screen = await render(<PasswordInput aria-label="Password" />);

  await expect
    .element(screen.getByLabelText('Password', { exact: true }))
    .toHaveAttribute('type', 'password');
  await expect
    .element(screen.getByRole('button', { name: 'Show password' }))
    .toHaveAttribute('aria-pressed', 'false');
});

test('accepts typed text', async () => {
  const screen = await render(<PasswordInput aria-label="Password" />);

  const input = screen.getByLabelText('Password', { exact: true });
  await input.fill('hunter2');

  await expect.element(input).toHaveValue('hunter2');
});

test('toggles the visibility of the value', async () => {
  const screen = await render(
    <PasswordInput aria-label="Password" defaultValue="hunter2" />,
  );

  const input = screen.getByLabelText('Password', { exact: true });
  const toggle = screen.getByRole('button', { name: 'Show password' });

  await toggle.click();
  await expect.element(input).toHaveAttribute('type', 'text');
  await expect.element(input).toHaveValue('hunter2');
  await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');

  await toggle.click();
  await expect.element(input).toHaveAttribute('type', 'password');
  await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('does not allow overriding the type', async () => {
  const screen = await render(
    // @ts-expect-error type is set by PasswordInput
    <PasswordInput aria-label="Password" type="text" />,
  );

  await expect
    .element(screen.getByLabelText('Password', { exact: true }))
    .toHaveAttribute('type', 'password');
});

test('does not submit the form when toggling', async () => {
  const onSubmit = vi.fn((event: { preventDefault: () => void }) =>
    event.preventDefault(),
  );
  const screen = await render(
    <form onSubmit={onSubmit}>
      <PasswordInput aria-label="Password" />
    </form>,
  );

  await screen.getByRole('button', { name: 'Show password' }).click();

  expect(onSubmit).not.toHaveBeenCalled();
});

test('disables the toggle with the input', async () => {
  const screen = await render(<PasswordInput aria-label="Password" disabled />);

  await expect
    .element(screen.getByLabelText('Password', { exact: true }))
    .toBeDisabled();
  await expect
    .element(screen.getByRole('button', { name: 'Show password' }))
    .toBeDisabled();
});

test('applies DANGEROUS_className to the input', async () => {
  const screen = await render(
    <PasswordInput aria-label="Password" DANGEROUS_className="mt-4" />,
  );

  await expect
    .element(screen.getByLabelText('Password', { exact: true }))
    .toHaveClass('mt-4');
});
