import { afterEach, expect, test, vi } from 'vite-plus/test';
import { act } from 'react';
import { render, renderHook } from 'vitest-browser-react';
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

test.each([NaN, -1, Infinity, 2 ** 31])(
  'throws when resetAfter is %s',
  async (resetAfter) => {
    await expect(
      render(<CopyButton text="secret" resetAfter={resetAfter} />),
    ).rejects.toThrow(RangeError);
  },
);

test.each([0, 2 ** 31 - 1])('accepts resetAfter %s', async (resetAfter) => {
  const screen = await render(
    <CopyButton text="secret" resetAfter={resetAfter} />,
  );

  await expect.element(screen.getByRole('button')).toBeVisible();
});

test.each([undefined, 42, null])(
  'throws without writing when copy gets %s',
  async (text) => {
    const clipboard = new TestClipboard();
    const { result } = await renderHook(() => useCopy(), {
      wrapper: ({ children }) => (
        <ClipboardProvider clipboard={clipboard}>{children}</ClipboardProvider>
      ),
    });

    // Synchronous, so the mistake can't be swallowed by a caller's catch.
    expect(() => result.current.copy(text as unknown as string)).toThrow(
      TypeError,
    );
    expect(clipboard.texts).toEqual([]);
  },
);

test('rejects with a clear error when the browser has no clipboard', async () => {
  vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue(
    undefined as unknown as Clipboard,
  );
  const onError = vi.fn();
  const screen = await render(<CopyButton text="secret" onError={onError} />);

  await screen.getByRole('button', { name: 'Copy' }).click();

  await vi.waitFor(() =>
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('secure context'),
      }),
    ),
  );
  await expect
    .element(screen.getByRole('button', { name: 'Copy' }))
    .toBeVisible();
});
