import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useEffect,
} from 'react';

/** Where the toasts sit: their horizontal center and their bottom edge, as CSS lengths. */
export type ToastPosition = { left: string; bottom: string };

export const ToastPositionContext = createContext<Dispatch<
  SetStateAction<ToastPosition | null>
> | null>(null);

/**
 * Moves the toasts to `position` while the calling component is mounted, e.g.
 * above a bar that sits where they would. They glide there. `null`, or
 * unmounting, puts them back at the bottom center of the viewport. Does
 * nothing outside a `ToastProvider`.
 */
export function useToastPosition(position: ToastPosition | null) {
  // Without a provider there are no toasts to move.
  const setPosition = use(ToastPositionContext);
  const left = position?.left;
  const bottom = position?.bottom;

  useEffect(() => {
    if (!setPosition) return;
    setPosition(
      left === undefined || bottom === undefined ? null : { left, bottom },
    );
    return () => setPosition(null);
  }, [setPosition, left, bottom]);
}
