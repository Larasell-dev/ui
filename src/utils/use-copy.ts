import { useCallback, useEffect, useRef, useState } from 'react';
import { useClipboard } from './clipboard.tsx';

/**
 * Copies text to the clipboard from `ClipboardProvider`, or the browser's.
 * `copied` is true for `resetAfter` milliseconds after a successful copy;
 * another copy restarts the wait. A failed write sets `copied` to false and
 * rejects with the clipboard's error.
 */
export function useCopy({ resetAfter = 2000 }: { resetAfter?: number } = {}) {
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = useCallback(
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

  return { copied, copy };
}
