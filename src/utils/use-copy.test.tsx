import { afterEach, expect, test, vi } from 'vite-plus/test';
import { act } from 'react';
import { render } from 'vitest-browser-react';
import { ClipboardProvider, TestClipboard } from './clipboard.tsx';
import { useCopy } from './use-copy.ts';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function CopyButton({
  text,
  resetAfter,
  onError,
}: {
  text: string;
  resetAfter?: number;
  onError?: (error: unknown) => void;
}) {
  const { copied, copy } = useCopy({ resetAfter });
  return (
    <button onClick={() => copy(text).catch(onError)}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

test('writes the text to the clipboard from context', async () => {
  const clipboard = new TestClipboard();
  const screen = await render(
    <ClipboardProvider clipboard={clipboard}>
      <CopyButton text="secret" />
    </ClipboardProvider>,
  );

  await screen.getByRole('button', { name: 'Copy' }).click();

  await expect
    .element(screen.getByRole('button', { name: 'Copied' }))
    .toBeVisible();
  expect(clipboard.texts).toEqual(['secret']);
});

test('accepts any ClipboardWriter, such as one built from spies', async () => {
  const writeText = vi.fn(() => Promise.resolve());
  const screen = await render(
    <ClipboardProvider clipboard={{ writeText }}>
      <CopyButton text="secret" />
    </ClipboardProvider>,
  );

  await screen.getByRole('button', { name: 'Copy' }).click();

  await expect
    .element(screen.getByRole('button', { name: 'Copied' }))
    .toBeVisible();
  expect(writeText).toHaveBeenCalledExactlyOnceWith('secret');
});

test('falls back to the browser clipboard outside a provider', async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValue(undefined);
  const screen = await render(<CopyButton text="secret" />);

  await screen.getByRole('button', { name: 'Copy' }).click();

  await expect
    .element(screen.getByRole('button', { name: 'Copied' }))
    .toBeVisible();
  expect(writeText).toHaveBeenCalledExactlyOnceWith('secret');
});

test('resets copied after resetAfter, restarting on every copy', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  const clipboard = new TestClipboard();
  const screen = await render(
    <ClipboardProvider clipboard={clipboard}>
      <CopyButton text="secret" resetAfter={1000} />
    </ClipboardProvider>,
  );
  const button = screen.getByRole('button');
  // Inside act, so the reset renders before the synchronous assertions below.
  // expect.element would retry and could pass on the stale text.
  const advance = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

  await button.click();
  await expect.element(button).toHaveTextContent('Copied');

  await advance(600);
  await button.click();
  await expect.element(button).toHaveTextContent('Copied');
  // The first copy's timer would have fired here.
  await advance(600);
  expect(button.element()).toHaveTextContent('Copied');

  await advance(400);
  expect(button.element()).toHaveTextContent('Copy');
  expect(button.element()).not.toHaveTextContent('Copied');
  expect(clipboard.texts).toEqual(['secret', 'secret']);
});

test('rejects and stays not copied when the write fails', async () => {
  const clipboard = new TestClipboard();
  const error = new DOMException('Denied', 'NotAllowedError');
  clipboard.failWith(error);
  const onError = vi.fn();
  const screen = await render(
    <ClipboardProvider clipboard={clipboard}>
      <CopyButton text="secret" onError={onError} />
    </ClipboardProvider>,
  );

  await screen.getByRole('button', { name: 'Copy' }).click();

  await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(error));
  await expect
    .element(screen.getByRole('button', { name: 'Copy' }))
    .toBeVisible();
  expect(clipboard.texts).toEqual([]);
});
