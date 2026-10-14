import { expect, test, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Button } from './button.tsx';

test('calls onClick when pressed', async () => {
  const onClick = vi.fn();
  const screen = await render(<Button onClick={onClick}>Save</Button>);

  await screen.getByRole('button', { name: 'Save' }).click();

  expect(onClick).toHaveBeenCalledOnce();
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <Button className="mt-4">Save</Button>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Save' }))
    .not.toHaveClass('mt-4');
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await render(<Button DANGEROUS_className="mt-4">Save</Button>);

  const button = screen.getByRole('button', { name: 'Save' });

  await expect.element(button).toHaveClass('mt-4');
  await expect.element(button).toHaveClass('bg-mauve-950');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <Button style={{ marginTop: 16 }}>Save</Button>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Save' }))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await render(
    <Button DANGEROUS_style={{ marginTop: '16px' }}>Save</Button>,
  );

  const button = screen.getByRole('button', { name: 'Save' });

  await expect.element(button).toHaveStyle({ marginTop: '16px' });
});
