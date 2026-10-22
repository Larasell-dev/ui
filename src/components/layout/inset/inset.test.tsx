import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Inset } from './inset.tsx';

// Tests run without Tailwind's CSS, so check which sides get the --inset padding class.
function paddedSides(element: Element) {
  return element.className.split(' ').sort();
}

test('pads every side by default', async () => {
  const screen = await render(<Inset>Content</Inset>);

  expect(paddedSides(screen.getByText('Content').element())).toEqual([
    'pb-(--inset)',
    'pl-(--inset)',
    'pr-(--inset)',
    'pt-(--inset)',
  ]);
});

test('pads only the given sides', async () => {
  const screen = await render(
    <>
      <Inset side="x">Axis</Inset>
      <Inset side={['top', 'left']}>Sides</Inset>
      <Inset side="bottom">Side</Inset>
    </>,
  );

  expect(paddedSides(screen.getByText('Axis').element())).toEqual([
    'pl-(--inset)',
    'pr-(--inset)',
  ]);
  expect(paddedSides(screen.getByText('Sides').element())).toEqual([
    'pl-(--inset)',
    'pt-(--inset)',
  ]);
  expect(paddedSides(screen.getByText('Side').element())).toEqual([
    'pb-(--inset)',
  ]);
});
