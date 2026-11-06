import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { TruncateMiddle } from './truncate-middle.tsx';

const url = 'shop.example.com/collections/autumn-winter-2026/en/';

/** The text the box shows, without the copies only measuring and screen readers use. */
const shown = (container: HTMLElement) =>
  container.querySelector('[data-truncate-middle] > :nth-child(2)')!;

test('keeps both ends and cuts the middle of text that does not fit', async () => {
  const screen = await render(
    <div style={{ width: 120 }}>
      <TruncateMiddle>{url}</TruncateMiddle>
    </div>,
  );
  const text = shown(screen.container);

  await expect.poll(() => text.textContent).toContain('…');
  const [start, end] = text.textContent!.split('…');

  expect(url.startsWith(start!)).toBe(true);
  expect(url.endsWith(end!)).toBe(true);
  // Half from each end, the extra character at the start.
  expect(start!.length - end!.length).toBeGreaterThanOrEqual(0);
  expect(start!.length - end!.length).toBeLessThanOrEqual(1);
  expect(text.getBoundingClientRect().width).toBeLessThanOrEqual(120);
});

test('keeps as much as fits: one more character would overflow', async () => {
  const screen = await render(
    <div style={{ width: 120 }}>
      <TruncateMiddle>{url}</TruncateMiddle>
    </div>,
  );
  const text = shown(screen.container);
  await expect.poll(() => text.textContent).toContain('…');

  const kept = text.textContent!.length - 1;
  const start = Math.ceil((kept + 1) / 2);
  const longer = `${url.slice(0, start)}…${url.slice(url.length - (kept + 1 - start))}`;
  const probe = document.createElement('span');
  probe.style.whiteSpace = 'pre';
  probe.textContent = longer;
  text.parentElement!.append(probe);

  expect(probe.getBoundingClientRect().width).toBeGreaterThan(120);
  probe.remove();
});

test('shows text that fits whole and does not mark it truncated', async () => {
  const screen = await render(
    <div style={{ width: 400 }}>
      <TruncateMiddle>shop.de/en/</TruncateMiddle>
    </div>,
  );

  expect(shown(screen.container).textContent).toBe('shop.de/en/');
  expect(
    screen.container.querySelector('[data-truncate-middle]'),
  ).not.toHaveAttribute('data-truncated');
});

test('fits the text again when its box grows or shrinks', async () => {
  const screen = await render(
    <div data-testid="box" style={{ width: 120 }}>
      <TruncateMiddle>{url}</TruncateMiddle>
    </div>,
  );
  const box = screen.getByTestId('box').element() as HTMLElement;
  const text = shown(screen.container);
  await expect.poll(() => text.textContent).toContain('…');

  box.style.width = '1000px';
  await expect.poll(() => text.textContent).toBe(url);

  box.style.width = '80px';
  await expect.poll(() => text.textContent).toContain('…');
});

test('grows to its text in a flex row instead of staying at its cut width', async () => {
  const screen = await render(
    <div data-testid="row" style={{ display: 'flex', width: 120 }}>
      <TruncateMiddle>{url}</TruncateMiddle>
    </div>,
  );
  const text = shown(screen.container);
  await expect.poll(() => text.textContent).toContain('…');

  (screen.getByTestId('row').element() as HTMLElement).style.width = '1000px';

  await expect.poll(() => text.textContent).toBe(url);
});

test('never cuts an emoji in half', async () => {
  const screen = await render(
    <div style={{ width: 60 }}>
      <TruncateMiddle>{'👟👟👟👟👟👟👟👟👟👟👟👟'}</TruncateMiddle>
    </div>,
  );
  const text = shown(screen.container);
  await expect.poll(() => text.textContent).toContain('…');

  expect(text.textContent).toMatch(/^(👟)*…(👟)*$/u);
});

test('reads the whole text to screen readers, once', async () => {
  const screen = await render(
    <div style={{ width: 120 }}>
      <TruncateMiddle>{url}</TruncateMiddle>
    </div>,
  );

  const read = [...screen.container.querySelectorAll('span')].filter(
    (span) =>
      !span.closest('[aria-hidden="true"]') && span.childElementCount === 0,
  );
  expect(read.map((span) => span.textContent)).toEqual([url]);
});
