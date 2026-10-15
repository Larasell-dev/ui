import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Inline } from './inline.tsx';

test('spaces its children with a step from the scale', async () => {
  const screen = await render(
    <Inline spacing={4} data-testid="inline">
      <div>One</div>
      <div>Two</div>
    </Inline>,
  );

  await expect
    .element(screen.getByTestId('inline'))
    .toHaveStyle({ columnGap: '16px' });
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is not accepted; spacing belongs to the parent
    <Inline spacing={4} data-testid="inline" className="mt-4">
      <div>One</div>
    </Inline>,
  );

  await expect.element(screen.getByTestId('inline')).not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is not accepted; spacing belongs to the parent
    <Inline spacing={4} data-testid="inline" style={{ marginTop: 16 }}>
      <div>One</div>
    </Inline>,
  );

  await expect
    .element(screen.getByTestId('inline'))
    .not.toHaveStyle({ marginTop: '16px' });
});
