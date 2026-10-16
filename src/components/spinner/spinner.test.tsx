import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Spinner } from './spinner.tsx';

test('is announced as a status named "Loading" by default', async () => {
  const screen = await render(<Spinner />);

  await expect
    .element(screen.getByRole('status', { name: 'Loading' }))
    .toBeVisible();
});

test('uses aria-label as its accessible name', async () => {
  const screen = await render(<Spinner aria-label="Saving order" />);

  await expect
    .element(screen.getByRole('status', { name: 'Saving order' }))
    .toBeVisible();
});

test('hides the glyph itself from assistive tech', async () => {
  const screen = await render(<Spinner />);

  await expect
    .element(screen.getByRole('img', { includeHidden: true }))
    .toHaveAttribute('aria-hidden', 'true');
});

test('is decorative when aria-hidden, e.g. inside a busy button', async () => {
  const screen = await render(<Spinner aria-hidden />);

  await expect
    .element(screen.getByRole('img', { includeHidden: true }))
    .toBeInTheDocument();
  await expect.element(screen.getByRole('status')).not.toBeInTheDocument();
  await expect
    .element(screen.getByRole('status', { includeHidden: true }))
    .not.toBeInTheDocument();
});

test('does not accept className or style', async () => {
  const screen = await render(
    <Spinner
      // @ts-expect-error className is blocked
      className="mt-4"
      style={{ marginTop: 16 }}
    />,
  );

  const spinner = screen.getByRole('status');

  await expect.element(spinner).not.toHaveClass('mt-4');
  await expect.element(spinner).not.toHaveStyle({ marginTop: '16px' });
});

test('accepts DANGEROUS_className and DANGEROUS_style', async () => {
  const screen = await render(
    <Spinner DANGEROUS_className="mt-4" DANGEROUS_style={{ marginLeft: 8 }} />,
  );

  const spinner = screen.getByRole('status');

  await expect.element(spinner).toHaveClass('mt-4');
  await expect.element(spinner).toHaveStyle({ marginLeft: '8px' });
});
