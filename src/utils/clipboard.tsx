import { createContext, useContext, type ReactNode } from 'react';

/** The part of the clipboard the UI writes to. */
export type ClipboardWriter = {
  writeText: (text: string) => Promise<void>;
};

/**
 * Writes to `navigator.clipboard`. Used when no provider is present. Rejects
 * when the browser has no clipboard, as in insecure contexts.
 */
export const browserClipboard: ClipboardWriter = {
  // Looked up on every call, so tests can spy on `navigator.clipboard`.
  writeText: (text) => {
    // Typed as always present, but browsers leave it out over plain HTTP.
    // Rejecting, like a denied write, lets callers handle both the same way.
    if (navigator.clipboard === undefined) {
      return Promise.reject(
        new Error(
          'The clipboard is unavailable: navigator.clipboard needs a secure context (HTTPS or localhost).',
        ),
      );
    }
    return navigator.clipboard.writeText(text);
  },
};

/**
 * An in-memory clipboard for tests. Records every write in `texts`, and fails
 * every write after `failWith(error)`.
 */
export class TestClipboard implements ClipboardWriter {
  readonly texts: string[] = [];
  #failure: { error: unknown } | null = null;

  get lastText(): string | undefined {
    return this.texts.at(-1);
  }

  failWith(error: unknown) {
    this.#failure = { error };
  }

  writeText = (text: string) => {
    if (this.#failure) return Promise.reject(this.#failure.error);
    this.texts.push(text);
    return Promise.resolve();
  };
}

const ClipboardContext = createContext<ClipboardWriter>(browserClipboard);

/** Sets the clipboard for everything below it, such as a `TestClipboard`. */
export function ClipboardProvider({
  clipboard,
  children,
}: {
  clipboard: ClipboardWriter;
  children: ReactNode;
}) {
  return <ClipboardContext value={clipboard}>{children}</ClipboardContext>;
}

/** The nearest provider's clipboard, or `browserClipboard` without one. */
export function useClipboard(): ClipboardWriter {
  return useContext(ClipboardContext);
}
