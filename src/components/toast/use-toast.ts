import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useMemo } from 'react';

export type ToastOptions = {
  /** Adding a toast with the id of one that's shown updates it instead. */
  id?: string;
  /** What happened, e.g. "Product saved". */
  title: ReactNode;
  /** More detail, in smaller text below the title. */
  description?: ReactNode;
  /** Overrides the provider's timeout for this toast. `0` keeps it until closed. */
  timeout?: number;
  /** `high` interrupts screen readers; for errors the admin must notice. */
  priority?: 'low' | 'high';
  /** A button beside the title, e.g. `{ children: 'Undo', onClick }`. */
  actionProps?: ComponentPropsWithoutRef<'button'>;
  /** Called once the toast is closed, by the admin or its timeout. */
  onClose?: () => void;
};

/**
 * Adds toasts to the surrounding `ToastProvider` from anywhere in it, e.g.
 * `toast.add({ title: 'Product saved' })`.
 */
export function useToast() {
  const { add, close } = BaseToast.useToastManager();

  return useMemo(
    () => ({
      /** Shows a toast and returns its id. */
      add: (options: ToastOptions): string => add(options),
      /** Closes the toast with the id, or every toast without one. */
      close: (id?: string) => close(id),
    }),
    [add, close],
  );
}
