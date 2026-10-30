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

test('shows a toast once when the same text is added twice', async () => {
  const toast = await renderToasts();

  toast.add({ title: 'Product saved', description: 'Visible in the shop' });
  await expect.element(page.getByText('Product saved')).toBeVisible();
  toast.add({ title: 'Product saved', description: 'Visible in the shop' });
  await wait(100);

  expect(page.getByText('Product saved').elements()).toHaveLength(1);
});

test('stacks toasts whose text differs', async () => {
  const toast = await renderToasts();

  toast.add({ title: 'Product saved', description: 'Visible in the shop' });
  toast.add({ title: 'Product saved', description: 'Hidden in the shop' });
  toast.add({ title: 'Image uploaded' });

  await expect.element(page.getByText('Visible in the shop')).toBeVisible();
  await expect.element(page.getByText('Hidden in the shop')).toBeVisible();
  await expect.element(page.getByText('Image uploaded')).toBeVisible();
  expect(page.getByText('Product saved').elements()).toHaveLength(2);
});

test('shows a toast once when the same id is added twice, with the latest text', async () => {
  const toast = await renderToasts();

  toast.add({ id: 'upload', title: 'Uploading 1 image' });
  await expect.element(page.getByText('Uploading 1 image')).toBeVisible();
  toast.add({ id: 'upload', title: 'Uploading 2 images' });

  await expect.element(page.getByText('Uploading 2 images')).toBeVisible();
  expect(page.getByText(/Uploading/).elements()).toHaveLength(1);
});

test.each([
  { name: 'with', bump: undefined },
  { name: 'without', bump: false },
])(
  'a duplicate $name a bump restarts the timeout of the toast that is shown',
  async ({ bump }) => {
    const toast = await renderToasts(1000);

    toast.add({ title: 'Product saved', bump });
    await expect.element(page.getByText('Product saved')).toBeVisible();
    const shown = page.getByText('Product saved').element();
    await wait(700);
    toast.add({ title: 'Product saved', bump });
    // Past the first toast's timeout, but not the restarted one.
    await wait(600);

    expect(shown.isConnected).toBe(true);
    expect(page.getByText('Product saved').elements()).toHaveLength(1);
    await expect
      .element(page.getByText('Product saved'), { timeout: 2000 })
      .not.toBeInTheDocument();
  },
);

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
