import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Spacer } from './spacer.tsx';

test('adds vertical space from the scale by default', async () => {
  const screen = await render(<Spacer spacing={4} data-testid="spacer" />);

  const { height } = screen
    .getByTestId('spacer')
    .element()
    .getBoundingClientRect();

  expect(height).toBe(16);
});

test('adds horizontal space from the scale', async () => {
  const screen = await render(
    <Spacer spacing={4} axis="horizontal" data-testid="spacer" />,
  );

  const { width, height } = screen
    .getByTestId('spacer')
    .element()
    .getBoundingClientRect();

  expect({ width, height }).toEqual({ width: 16, height: 0 });
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is not accepted; spacing belongs to the parent
    <Spacer spacing={4} data-testid="spacer" className="mt-4" />,
  );

  await expect.element(screen.getByTestId('spacer')).not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is not accepted; spacing belongs to the parent
    <Spacer spacing={4} data-testid="spacer" style={{ marginTop: 16 }} />,
  );

  await expect
    .element(screen.getByTestId('spacer'))
    .not.toHaveStyle({ marginTop: '16px' });
});
