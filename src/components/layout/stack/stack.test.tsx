import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Stack } from './stack.tsx';

test('spaces its children with a step from the scale', async () => {
  const screen = await render(
    <Stack spacing={4} data-testid="stack">
      <div>One</div>
      <div>Two</div>
    </Stack>,
  );

  await expect
    .element(screen.getByTestId('stack'))
    .toHaveStyle({ rowGap: '16px' });
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is not accepted; spacing belongs to the parent
    <Stack spacing={4} data-testid="stack" className="mt-4">
      <div>One</div>
    </Stack>,
  );

  await expect.element(screen.getByTestId('stack')).not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is not accepted; spacing belongs to the parent
    <Stack spacing={4} data-testid="stack" style={{ marginTop: 16 }}>
      <div>One</div>
    </Stack>,
  );

  await expect
    .element(screen.getByTestId('stack'))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('only accepts spacing from the Tailwind scale', async () => {
  const screen = await render(
    // @ts-expect-error 13 is not on the Tailwind spacing scale
    <Stack spacing={13} data-testid="stack">
      <div>One</div>
    </Stack>,
  );

  await expect.element(screen.getByTestId('stack')).toBeInTheDocument();
});

test('aligns children on the cross axis', async () => {
  const screen = await render(
    <Stack spacing={4} align="center" data-testid="stack">
      <div>One</div>
    </Stack>,
  );

  await expect
    .element(screen.getByTestId('stack'))
    .toHaveStyle({ alignItems: 'center' });
});

test('justifies children on the main axis', async () => {
  const screen = await render(
    <Stack spacing={4} justify="between" data-testid="stack">
      <div>One</div>
    </Stack>,
  );

  await expect
    .element(screen.getByTestId('stack'))
    .toHaveStyle({ justifyContent: 'space-between' });
});

test('keeps the flexbox defaults without align or justify', async () => {
  const screen = await render(
    <Stack spacing={4} data-testid="stack">
      <div>One</div>
    </Stack>,
  );

  await expect
    .element(screen.getByTestId('stack'))
    .toHaveStyle({ alignItems: 'normal', justifyContent: 'normal' });
});
