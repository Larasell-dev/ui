import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Spacer } from './spacer.tsx';

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
