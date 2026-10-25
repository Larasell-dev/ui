import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Input } from './input.tsx';

test('accepts typed text', async () => {
  const screen = await render(<Input aria-label="Email" />);

  const input = screen.getByRole('textbox', { name: 'Email' });
  await input.fill('ada@example.com');

  await expect.element(input).toHaveValue('ada@example.com');
});

test('renders the prefix and suffix', async () => {
  const screen = await render(
    <Input
      aria-label="Website"
      prefix={<span>https://</span>}
      suffix={<button type="button">Copy</button>}
    />,
  );

  await expect.element(screen.getByText('https://')).toBeVisible();
  await expect
    .element(screen.getByRole('button', { name: 'Copy' }))
    .toBeVisible();
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <Input aria-label="Email" className="mt-4" />,
  );

  await expect
    .element(screen.getByRole('textbox', { name: 'Email' }))
    .not.toHaveClass('mt-4');
});

test('applies DANGEROUS_className to the container', async () => {
  const screen = await render(
    <Input
      aria-label="Email"
      prefix={<span data-testid="prefix" />}
      DANGEROUS_className="mt-4"
    />,
  );

  const container = screen.getByTestId('prefix').element().parentElement;

  expect(container).toHaveClass('mt-4');
  expect(container).toHaveClass('border-border');
  await expect
    .element(screen.getByRole('textbox', { name: 'Email' }))
    .not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <Input aria-label="Email" style={{ marginTop: 16 }} />,
  );

  await expect
    .element(screen.getByRole('textbox', { name: 'Email' }))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_style to the container', async () => {
  const screen = await render(
    <Input
      aria-label="Email"
      prefix={<span data-testid="prefix" />}
      DANGEROUS_style={{ marginTop: '16px' }}
    />,
  );

  expect(screen.getByTestId('prefix').element().parentElement).toHaveStyle({
    marginTop: '16px',
  });
});
