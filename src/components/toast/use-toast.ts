import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useMemo } from 'react';

type ToastBaseOptions = {
  /**
   * Adding a toast with the id of one that's shown updates it and restarts
   * its timeout instead. Without an id, a toast whose title and description
   * are the same strings as a shown one's counts as that toast.
   */
  id?: string;
  /** Overrides the provider's timeout for this toast. `0` keeps it until closed. */
  timeout?: number;
  /** `high` interrupts screen readers; for errors the admin must notice. */
  priority?: 'low' | 'high';
  /** Called once the toast is closed, by the admin or its timeout. */
  onClose?: () => void;
};

type ToastTextOptions = ToastBaseOptions & {
  /** What happened, e.g. "Product saved". */
  title: ReactNode;
  /** More detail, in smaller text below the title. */
  description?: ReactNode;
  /** A button beside the title, e.g. `{ children: 'Undo', onClick }`. */
  actionProps?: ComponentPropsWithoutRef<'button'>;
  children?: never;
};

type ToastCustomOptions = ToastBaseOptions & {
  /**
   * Rendered as the whole toast, in place of the title, description and
   * buttons. It can keep its own state, which a duplicate with the same id
   * keeps, too. It runs to the toast's edges; wrap it in `<Inset>` to pad
   * it.
   */
  children: ReactNode;
  title?: never;
  description?: never;
  actionProps?: never;
};

export type ToastOptions = ToastTextOptions | ToastCustomOptions;

/** What the toast renders besides Base UI's own fields. */
export type ToastData = {
  children?: ReactNode;
};

/** Text-only toasts with the same strings get the same id, so they dedupe. */
function textId(options: ToastOptions) {
  const { title, description } = options;
  if (typeof title !== 'string') return undefined;
  if (description != null && typeof description !== 'string') return undefined;
  return `text:${JSON.stringify([title, description ?? null])}`;
}

/**
 * Adds toasts to the surrounding `ToastProvider` from anywhere in it, e.g.
 * `toast.add({ title: 'Product saved' })`.
 */
export function useToast() {
  const { add, close } = BaseToast.useToastManager<ToastData>();

  return useMemo(
    () => ({
      /** Shows a toast, or updates the one it duplicates, and returns its id. */
      add: (options: ToastOptions): string => {
        const { children, ...rest } = options;
        return add({
          ...rest,
          id: options.id ?? textId(options),
          data: { children },
        });
      },
      /** Closes the toast with the id, or every toast without one. */
      close: (id?: string) => close(id),
    }),
    [add, close],
  );
}
