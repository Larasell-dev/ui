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

test('focuses the input when the prefix or suffix text is clicked, not a button in it', async () => {
  const screen = await render(
    // Inside a focusable page wrapper, as apps put their main content.
    <main tabIndex={-1}>
      <Input
        aria-label="Website"
        prefix={<span>https://</span>}
        suffix={<button type="button">Copy</button>}
      />
    </main>,
  );
  const input = screen.getByRole('textbox', { name: 'Website' });

  await screen.getByText('https://').click();
  await expect.element(input).toHaveFocus();

  await screen.getByRole('button', { name: 'Copy' }).click();
  await expect
    .element(screen.getByRole('button', { name: 'Copy' }))
    .toHaveFocus();
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

  const container = screen
    .getByTestId('prefix')
    .element()
    .closest('[data-input-prefix]')!.parentElement;

  expect(container).toHaveClass('mt-4');
  expect(container).toHaveClass('border-base-strong');
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

  expect(
    screen.getByTestId('prefix').element().closest('[data-input-prefix]')!
      .parentElement,
  ).toHaveStyle({
    marginTop: '16px',
  });
});
