import { expect, test } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Textarea } from './textarea.tsx';

// Growing with its text is the behaviour under test, so these measure it.
test('grows with its lines, then stops at its max height and scrolls', async () => {
  const screen = await render(
    <Textarea aria-label="Street" DANGEROUS_style={{ maxHeight: 120 }} />,
  );
  const textbox = screen.getByRole('textbox', { name: 'Street' });
  const element = textbox.element() as HTMLTextAreaElement;
  const start = element.offsetHeight;

  await userEvent.type(textbox, '1{Enter}2{Enter}3{Enter}4');
  const grown = element.offsetHeight;
  await userEvent.type(
    textbox,
    '{Enter}5{Enter}6{Enter}7{Enter}8{Enter}9{Enter}10',
  );

  expect(grown).toBeGreaterThan(start);
  const capped = element.offsetHeight;
  await userEvent.type(textbox, '{Enter}11{Enter}12');
  expect(element.offsetHeight).toBe(capped);
  expect(element.scrollHeight).toBeGreaterThan(element.clientHeight);
  expect(element.classList).toContain('scroll-mask-y');
});

test('fits a long first text without fading', async () => {
  const screen = await render(
    <Textarea aria-label="Street" defaultValue={'1\n2\n3\n4'} />,
  );
  const element = screen
    .getByRole('textbox', { name: 'Street' })
    .element() as HTMLTextAreaElement;

  expect(element.scrollHeight).toBeLessThanOrEqual(element.clientHeight);
  expect(element.classList).not.toContain('scroll-mask-y');
});
