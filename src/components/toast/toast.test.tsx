import { useState } from 'react';
import { expect, test } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { ToastProvider } from './toast-provider.tsx';
import { useToast } from './use-toast.ts';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Renders a provider and returns the `useToast` API from inside it. */
async function renderToasts(timeout?: number) {
  let toast: ReturnType<typeof useToast> | undefined;
  function Capture() {
    toast = useToast();
    return null;
  }
  await render(
    <ToastProvider timeout={timeout}>
      <Capture />
    </ToastProvider>,
  );
  if (!toast) throw new Error('useToast was not captured');
  return toast;
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

test('renders children instead of a title', async () => {
  const toast = await renderToasts();

  toast.add({ children: <Counter /> });

  await expect
    .element(page.getByRole('button', { name: 'Count: 0' }))
    .toBeVisible();
});

test('custom content keeps its state when a duplicate with its id is added', async () => {
  const toast = await renderToasts();

  toast.add({ id: 'counter', children: <Counter /> });
  await page.getByRole('button', { name: 'Count: 0' }).click();
  await expect
    .element(page.getByRole('button', { name: 'Count: 1' }))
    .toBeVisible();
  toast.add({ id: 'counter', children: <Counter /> });
  await wait(100);

  await expect
    .element(page.getByRole('button', { name: 'Count: 1' }))
    .toBeVisible();
  expect(page.getByRole('button', { name: /Count/ }).elements()).toHaveLength(
    1,
  );
});

test('a toast takes either a title or children', async () => {
  const toast = await renderToasts();

  // @ts-expect-error children replace the title, so a toast can't have both
  toast.add({ title: 'Saved', children: <Counter /> });
  // @ts-expect-error a toast needs a title or children
  toast.add({});
  // @ts-expect-error custom content pads itself with <Inset>
  toast.add({ children: <Counter />, inset: true });
});
