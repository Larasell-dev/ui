import { Field } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Error } from './error.tsx';

function renderError(error: ReactNode) {
  return render(<Field.Root invalid>{error}</Field.Root>);
}

test('renders its text', async () => {
  const screen = await renderError(
    <Error match>Enter an email address.</Error>,
  );

  await expect
    .element(screen.getByText('Enter an email address.'))
    .toBeVisible();
});

test('does not accept className', async () => {
  const screen = await renderError(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <Error match className="mt-4">
      Enter an email address.
    </Error>,
  );

  await expect
    .element(screen.getByText('Enter an email address.'))
    .not.toHaveClass('mt-4');
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await renderError(
    <Error match DANGEROUS_className="mt-4">
      Enter an email address.
    </Error>,
  );

  const error = screen.getByText('Enter an email address.');

  await expect.element(error).toHaveClass('mt-4');
  await expect.element(error).toHaveClass('text-red-600');
});

test('does not accept style', async () => {
  const screen = await renderError(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <Error match style={{ marginTop: 16 }}>
      Enter an email address.
    </Error>,
  );

  await expect
    .element(screen.getByText('Enter an email address.'))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await renderError(
    <Error match DANGEROUS_style={{ marginTop: '16px' }}>
      Enter an email address.
    </Error>,
  );

  await expect
    .element(screen.getByText('Enter an email address.'))
    .toHaveStyle({ marginTop: '16px' });
});
