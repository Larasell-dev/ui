import '../../../../test/tailwind.css';
import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { AddLine } from '../../../icons.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from './icon-button.tsx';

test('is named by its aria-label and hides the icon from assistive tech', async () => {
  const screen = await render(<IconButton icon={AddLine} aria-label="Add" />);

  const button = screen.getByRole('button', { name: 'Add' });

  await expect.element(button).toBeInTheDocument();
  expect(button.element().querySelector('svg')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
});

test('requires an aria-label and an icon', () => {
  // Type checks only; rendering without an icon would have nothing to draw.
  const withoutLabel = (
    // @ts-expect-error an icon-only button needs an aria-label
    <IconButton icon={AddLine} />
  );
  // @ts-expect-error the icon is required
  const withoutIcon = <IconButton aria-label="Add" />;

  expect([withoutLabel, withoutIcon]).toHaveLength(2);
});

test('does not accept children', async () => {
  const screen = await render(
    // @ts-expect-error the icon prop is the only content
    <IconButton icon={AddLine} aria-label="Add">
      Add
    </IconButton>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .not.toHaveTextContent('Add');
});

test.each(['md', 'sm'] as const)(
  'is square and as tall as a button in the %s size',
  async (size) => {
    const screen = await render(
      <div className="flex items-start gap-2">
        <Button size={size}>Save</Button>
        <IconButton size={size} icon={AddLine} aria-label="Add" />
      </div>,
    );

    const button = screen
      .getByRole('button', { name: 'Save' })
      .element()
      .getBoundingClientRect();
    const iconButton = screen
      .getByRole('button', { name: 'Add' })
      .element()
      .getBoundingClientRect();

    expect(iconButton.width).toBe(iconButton.height);
    expect(iconButton.height).toBe(button.height);
  },
);

test('uses the same colors as a button of the same variant', async () => {
  const screen = await render(
    <>
      <Button variant="destructive">Delete</Button>
      <IconButton variant="destructive" icon={AddLine} aria-label="Remove" />
    </>,
  );

  const color = (name: string) =>
    getComputedStyle(screen.getByRole('button', { name }).element())
      .backgroundColor;

  expect(color('Remove')).toBe(color('Delete'));
  expect(color('Remove')).not.toBe('rgba(0, 0, 0, 0)');
});

test('calls onClick when pressed', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <IconButton icon={AddLine} aria-label="Add" onClick={onClick} />,
  );

  await screen.getByRole('button', { name: 'Add' }).click();

  expect(onClick).toHaveBeenCalledOnce();
});

test('disabled button is disabled and ignores clicks', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <IconButton icon={AddLine} aria-label="Add" disabled onClick={onClick} />,
  );

  const button = screen.getByRole('button', { name: 'Add' });

  await expect.element(button).toBeDisabled();
  await userEvent.click(button, { force: true });
  expect(onClick).not.toHaveBeenCalled();
});

test('does not accept className or style', async () => {
  const screen = await render(
    <IconButton
      icon={AddLine}
      aria-label="Add"
      // @ts-expect-error className is blocked; use DANGEROUS_className
      className="mt-4"
      style={{ marginTop: 16 }}
    />,
  );

  const button = screen.getByRole('button', { name: 'Add' });

  await expect.element(button).not.toHaveClass('mt-4');
  await expect.element(button).not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_className and DANGEROUS_style', async () => {
  const screen = await render(
    <IconButton
      icon={AddLine}
      aria-label="Add"
      DANGEROUS_className="ml-4"
      DANGEROUS_style={{ marginTop: '16px' }}
    />,
  );

  const button = screen.getByRole('button', { name: 'Add' });

  await expect.element(button).toHaveClass('ml-4');
  await expect.element(button).toHaveStyle({ marginTop: '16px' });
});
