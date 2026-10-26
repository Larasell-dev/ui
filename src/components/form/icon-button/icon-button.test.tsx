import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { AddLine } from '../../../icons.ts';
import { Icon } from '../../icon/icon.tsx';
import { IconButton } from './icon-button.tsx';

test('is named by its aria-label and hides the icon from assistive tech', async () => {
  const screen = await render(
    <IconButton aria-label="Add">
      <Icon icon={AddLine} />
    </IconButton>,
  );

  const button = screen.getByRole('button', { name: 'Add' });

  await expect.element(button).toBeInTheDocument();
  expect(button.element().querySelector('svg')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
});

test('requires an aria-label and children', () => {
  // Type checks only.
  const withoutLabel = (
    // @ts-expect-error an icon-only button needs an aria-label
    <IconButton>
      <Icon icon={AddLine} />
    </IconButton>
  );
  // @ts-expect-error the icon is required
  const withoutIcon = <IconButton aria-label="Add" />;

  expect([withoutLabel, withoutIcon]).toHaveLength(2);
});

test('shows its children, so callers can wrap or animate the icon', async () => {
  const screen = await render(
    <IconButton aria-label="Open">
      <span data-testid="wrapper" className="rotate-90">
        <Icon icon={AddLine} />
      </span>
    </IconButton>,
  );

  const wrapper = screen.getByTestId('wrapper');
  await expect.element(wrapper).toBeInTheDocument();
  expect(wrapper.element().querySelector('svg')).not.toBeNull();
});

test('calls onClick when pressed', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <IconButton aria-label="Add" onClick={onClick}>
      <Icon icon={AddLine} />
    </IconButton>,
  );

  await screen.getByRole('button', { name: 'Add' }).click();

  expect(onClick).toHaveBeenCalledOnce();
});

test('is disabled', async () => {
  const screen = await render(
    <IconButton aria-label="Add" disabled>
      <Icon icon={AddLine} />
    </IconButton>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .toBeDisabled();
});

test('ignores clicks when disabled', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <IconButton aria-label="Add" disabled onClick={onClick}>
      <Icon icon={AddLine} />
    </IconButton>,
  );

  await userEvent.click(screen.getByRole('button', { name: 'Add' }), {
    force: true,
  });

  expect(onClick).not.toHaveBeenCalled();
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <IconButton aria-label="Add" className="mt-4">
      <Icon icon={AddLine} />
    </IconButton>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <IconButton aria-label="Add" style={{ marginTop: 16 }}>
      <Icon icon={AddLine} />
    </IconButton>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await render(
    <IconButton aria-label="Add" DANGEROUS_className="ml-4">
      <Icon icon={AddLine} />
    </IconButton>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .toHaveClass('ml-4');
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await render(
    <IconButton aria-label="Add" DANGEROUS_style={{ marginTop: '16px' }}>
      <Icon icon={AddLine} />
    </IconButton>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add' }))
    .toHaveStyle({ marginTop: '16px' });
});

test('renders a disabled link that keeps its role and does not navigate', async () => {
  const onLinkClick = vi.fn();
  const screen = await render(
    <IconButton
      aria-label="Back"
      disabled
      render={<a href="#back" onClick={onLinkClick} />}
    >
      <Icon icon={AddLine} />
    </IconButton>,
  );

  const link = screen.getByRole('link', { name: 'Back' });
  await expect.element(link).toHaveAttribute('aria-disabled', 'true');
  await expect.element(link).toHaveAttribute('data-disabled');
  await expect.element(link).not.toHaveAttribute('disabled');

  await userEvent.click(link, { force: true });
  await userEvent.tab();

  expect(onLinkClick).not.toHaveBeenCalled();
  expect(window.location.hash).not.toBe('#back');
  await expect.element(link).not.toHaveFocus();
});
