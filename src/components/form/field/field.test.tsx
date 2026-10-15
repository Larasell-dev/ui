import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Field } from './field.tsx';

test('shows the label and input', async () => {
  const screen = await render(<Field label="Email" name="email" />);

  await expect.element(screen.getByText('Email')).toBeVisible();
  await expect
    .element(screen.getByRole('textbox', { name: 'Email' }))
    .toBeVisible();
});

test('shows the error text when the field is invalid', async () => {
  const screen = await render(
    <Field label="Email" name="email" error="Enter an email address." />,
  );

  await expect
    .element(screen.getByText('Enter an email address.'))
    .toBeVisible();
  await expect
    .element(screen.getByRole('textbox', { name: 'Email' }))
    .toHaveAttribute('aria-invalid', 'true');
});

test('hides the error text when the field is valid', async () => {
  const screen = await render(<Field label="Email" name="email" />);

  await expect
    .element(screen.getByText('Enter an email address.'))
    .not.toBeInTheDocument();
});
