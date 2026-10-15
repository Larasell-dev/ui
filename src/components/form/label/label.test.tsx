import { Field } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Label } from './label.tsx';

function renderLabel(label: ReactNode) {
  return render(<Field.Root>{label}</Field.Root>);
}

test('renders its text', async () => {
  const screen = await renderLabel(<Label>Email</Label>);

  await expect.element(screen.getByText('Email')).toBeVisible();
});

test('marks a required label', async () => {
  const screen = await renderLabel(<Label required>Email</Label>);

  await expect.element(screen.getByText('*')).toBeVisible();
});

test('marks an optional label', async () => {
  const screen = await renderLabel(<Label required="optional">Email</Label>);

  await expect.element(screen.getByText('(Optional)')).toBeVisible();
});

test('does not accept className', async () => {
  const screen = await renderLabel(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <Label className="mt-4">Email</Label>,
  );

  await expect.element(screen.getByText('Email')).not.toHaveClass('mt-4');
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await renderLabel(
    <Label DANGEROUS_className="mt-4">Email</Label>,
  );

  const label = screen.getByText('Email');

  await expect.element(label).toHaveClass('mt-4');
  await expect.element(label).toHaveClass('text-mauve-950');
});

test('does not accept style', async () => {
  const screen = await renderLabel(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <Label style={{ marginTop: 16 }}>Email</Label>,
  );

  await expect
    .element(screen.getByText('Email'))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await renderLabel(
    <Label DANGEROUS_style={{ marginTop: '16px' }}>Email</Label>,
  );

  await expect
    .element(screen.getByText('Email'))
    .toHaveStyle({ marginTop: '16px' });
});
