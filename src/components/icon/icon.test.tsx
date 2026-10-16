import { expect, expectTypeOf, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Icon, type IconName } from './icon.tsx';

test('is hidden from assistive tech without a label', async () => {
  const screen = await render(<Icon name="home-line" />);

  await expect
    .element(screen.getByRole('img', { includeHidden: true }))
    .toHaveAttribute('aria-hidden', 'true');
  await expect.element(screen.getByRole('img')).not.toBeInTheDocument();
});

test('treats an empty label as decorative', async () => {
  const screen = await render(<Icon name="home-line" label="" />);

  await expect
    .element(screen.getByRole('img', { includeHidden: true }))
    .toHaveAttribute('aria-hidden', 'true');
  await expect.element(screen.getByRole('img')).not.toBeInTheDocument();
});

test('exposes a labelled icon as an image with that name', async () => {
  const screen = await render(<Icon name="error-warning-line" label="Error" />);

  const image = screen.getByRole('img', { name: 'Error' });

  await expect.element(image).toBeVisible();
  await expect.element(image).not.toHaveAttribute('aria-hidden');
});

test('is 1em square, so it scales with the surrounding font size', async () => {
  const screen = await render(
    <span style={{ fontSize: '32px' }}>
      <Icon name="home-line" />
    </span>,
  );

  const box = screen
    .getByRole('img', { includeHidden: true })
    .element()
    .getBoundingClientRect();

  expect(box.width).toBe(32);
  expect(box.height).toBe(32);
});

test('only accepts icons the design system exposes', () => {
  expectTypeOf<'home-line'>().toExtend<IconName>();
  // rocket-line is a Remix icon, but not one the design system exposes.
  expectTypeOf<'rocket-line'>().not.toExtend<IconName>();
});

test('does not accept className or style', async () => {
  const screen = await render(
    <Icon
      name="home-line"
      // @ts-expect-error className is blocked
      className="mt-4"
      style={{ marginTop: 16 }}
    />,
  );

  const icon = screen.getByRole('img', { includeHidden: true });

  await expect.element(icon).not.toHaveClass('mt-4');
  await expect.element(icon).not.toHaveStyle({ marginTop: '16px' });
});

test('does not accept DANGEROUS_className or DANGEROUS_style', async () => {
  const screen = await render(
    <Icon
      name="home-line"
      // @ts-expect-error Icon has no DANGEROUS_ escape hatch
      DANGEROUS_className="mt-4"
      DANGEROUS_style={{ marginTop: 16 }}
    />,
  );

  const icon = screen.getByRole('img', { includeHidden: true });

  await expect.element(icon).not.toHaveClass('mt-4');
  await expect.element(icon).not.toHaveStyle({ marginTop: '16px' });
});
