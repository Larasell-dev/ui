import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import '../../../../test/tailwind.css';
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

test('disabled button is disabled and ignores clicks', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <Button disabled onClick={onClick}>
      Save
    </Button>,
  );

  const button = screen.getByRole('button', { name: 'Save' });

  await expect.element(button).toBeDisabled();
  await userEvent.click(button, { force: true });
  expect(onClick).not.toHaveBeenCalled();
});

test('loading button stays focused and ignores events', async () => {
  const onClick = vi.fn();
  const onKeyDown = vi.fn();
  const screen = await render(
    <Button onClick={onClick} onKeyDown={onKeyDown}>
      Save
    </Button>,
  );

  const button = screen.getByRole('button', { name: 'Save' });
  await userEvent.tab();
  await expect.element(button).toHaveFocus();

  await screen.rerender(
    <Button loading onClick={onClick} onKeyDown={onKeyDown}>
      Save
    </Button>,
  );

  await expect.element(button).toHaveFocus();
  await expect.element(button).toHaveAttribute('aria-disabled', 'true');

  await userEvent.click(button, { force: true });
  await userEvent.keyboard('{Enter}');

  expect(onClick).not.toHaveBeenCalled();
  expect(onKeyDown).not.toHaveBeenCalled();
});

test('does not accept disabled together with loading', async () => {
  const screen = await render(
    // @ts-expect-error loading and disabled are mutually exclusive
    <Button loading disabled>
      Save
    </Button>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Save' }))
    .toBeInTheDocument();
});

test('ignores focusableWhenDisabled set from the outside', async () => {
  const screen = await render(
    // @ts-expect-error focusableWhenDisabled is controlled by loading
    <Button disabled focusableWhenDisabled>
      Save
    </Button>,
  );

  const button = screen.getByRole('button', { name: 'Save' });
  await userEvent.tab();

  await expect.element(button).not.toHaveFocus();
});

test('is as tall as the square nav buttons in the small size', async () => {
  const screen = await render(<Button size="sm">Save</Button>);

  const { height } = screen
    .getByRole('button', { name: 'Save' })
    .element()
    .getBoundingClientRect();

  expect(height).toBe(36);
});

test('keeps its height when loading', async () => {
  const screen = await render(<Button size="sm">Save</Button>);
  const button = screen.getByRole('button', { name: 'Save' }).element();
  const idle = button.getBoundingClientRect().height;

  await screen.rerender(
    <Button size="sm" loading>
      Save
    </Button>,
  );

  expect(button.getBoundingClientRect().height).toBe(idle);
});
