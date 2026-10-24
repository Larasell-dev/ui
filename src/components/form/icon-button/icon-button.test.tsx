import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { AddLine } from '../../../icons.ts';
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

test('calls onClick when pressed', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <IconButton icon={AddLine} aria-label="Add" onClick={onClick} />,
  );

  await screen.getByRole('button', { name: 'Add' }).click();

  expect(onClick).toHaveBeenCalledOnce();
});

test('is disabled', async () => {
  const screen = await render(
    <IconButton icon={AddLine} aria-label="Add" disabled />,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .toBeDisabled();
});

test('ignores clicks when disabled', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <IconButton icon={AddLine} aria-label="Add" disabled onClick={onClick} />,
  );

  await userEvent.click(screen.getByRole('button', { name: 'Add' }), {
    force: true,
  });

  expect(onClick).not.toHaveBeenCalled();
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <IconButton icon={AddLine} aria-label="Add" className="mt-4" />,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <IconButton icon={AddLine} aria-label="Add" style={{ marginTop: 16 }} />,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await render(
    <IconButton icon={AddLine} aria-label="Add" DANGEROUS_className="ml-4" />,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .toHaveClass('ml-4');
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await render(
    <IconButton
      icon={AddLine}
      aria-label="Add"
      DANGEROUS_style={{ marginTop: '16px' }}
    />,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .toHaveStyle({ marginTop: '16px' });
});
