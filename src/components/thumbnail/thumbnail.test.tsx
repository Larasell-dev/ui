import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { BookOpenLine } from '../../icons.ts';
import { Thumbnail } from './thumbnail.tsx';

test('shows the picture at the url, hidden from assistive tech by default', async () => {
  const screen = await render(<Thumbnail src="/covers/dune.jpg" />);

  const image = screen.container.querySelector('img');
  expect(image?.getAttribute('src')).toBe('/covers/dune.jpg');
  expect(image?.getAttribute('alt')).toBe('');
  expect(screen.getByRole('img').elements()).toHaveLength(0);
});

test('alt names a picture that is meaningful on its own', async () => {
  const screen = await render(
    <Thumbnail src="/covers/dune.jpg" alt="Cover of Dune" />,
  );

  await expect
    .element(screen.getByRole('img', { name: 'Cover of Dune' }))
    .toHaveAttribute('src', '/covers/dune.jpg');
});

test('shows an icon instead of a picture, hidden from assistive tech', async () => {
  const screen = await render(<Thumbnail icon={BookOpenLine} />);

  expect(screen.container.querySelector('img')).toBeNull();
  expect(
    screen.container.querySelector('svg')?.getAttribute('aria-hidden'),
  ).toBe('true');
});

test('title shows as a tooltip on a picture or an icon', async () => {
  const screen = await render(
    <>
      <Thumbnail src="/covers/dune.jpg" title="Frank Herbert" />
      <Thumbnail icon={BookOpenLine} title="Has an author" />
    </>,
  );

  expect(
    screen.getByTitle('Frank Herbert').element().querySelector('img'),
  ).not.toBeNull();
  expect(
    screen.getByTitle('Has an author').element().querySelector('svg'),
  ).not.toBeNull();
});

test('alt names an icon that is meaningful on its own', async () => {
  const screen = await render(<Thumbnail icon={BookOpenLine} alt="Book" />);

  await expect
    .element(screen.getByRole('img', { name: 'Book' }))
    .toBeInTheDocument();
});

test('an icon takes no shape', () => {
  // @ts-expect-error Only pictures are round or square.
  void (<Thumbnail icon={BookOpenLine} shape="round" />);
});
