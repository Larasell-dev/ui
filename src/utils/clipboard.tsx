import { createContext, useContext, type ReactNode } from 'react';

/** The part of the clipboard the UI writes to. */
export type ClipboardWriter = {
  writeText: (text: string) => Promise<void>;
};

/** Writes to `navigator.clipboard`. Used when no provider is present. */
export const browserClipboard: ClipboardWriter = {
  // Looked up on every call, so tests can spy on `navigator.clipboard`.
  writeText: (text) => navigator.clipboard.writeText(text),
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
