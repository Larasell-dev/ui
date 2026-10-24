import { useCallback, useEffect, useRef, useState } from 'react';
import { useClipboard } from './clipboard.tsx';

// The largest delay setTimeout supports, 2^31 - 1 ms (about 24.8 days).
const maxTimeout = 2 ** 31 - 1;

/**
 * Copies text to the clipboard from `ClipboardProvider`, or the browser's.
 * `copied` is true for `resetAfter` milliseconds after a successful copy;
 * another copy restarts the wait. A failed write sets `copied` to false and
 * rejects with the clipboard's error.
 *
 * Throws on a `resetAfter` that `setTimeout` can't wait for, and when `copy`
 * gets anything but a string: these are mistakes in the calling code, not
 * failures to handle.
 */
export function useCopy({ resetAfter = 2000 }: { resetAfter?: number } = {}) {
  // setTimeout runs NaN, negative and over-limit delays almost at once, so
  // `copied` would flash and reset with no sign of the mistake.
  if (!(resetAfter >= 0 && resetAfter <= maxTimeout)) {
    throw new RangeError(
      `useCopy: resetAfter must be between 0 and ${maxTimeout} ms, got ${resetAfter}.`,
    );
  }
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const write = useCallback(
    async (text: string) => {
      clearTimeout(timeout.current);
      try {
        await clipboard.writeText(text);
      } catch (error) {
        setCopied(false);
        throw error;
      }
      setCopied(true);
      timeout.current = setTimeout(() => setCopied(false), resetAfter);
    },
    [clipboard, resetAfter],
  );

  // Checks before writing, and throws instead of rejecting, so a caller's
  // catch for clipboard failures can't swallow it.
  const copy = useCallback(
    (text: string) => {
      if (typeof text !== 'string') {
        throw new TypeError(
          `useCopy: copy expects a string, got ${text === null ? 'null' : typeof text}.`,
        );
      }
      return write(text);
    },
    [write],
  );

  return { copied, copy };
}
