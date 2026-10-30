import { Toast as BaseToast, type ToastObject } from '@base-ui/react/toast';
import CloseLine from '@iconify-icons/ri/close-line';
import { cn } from 'cn';
import { type ReactNode, useState } from 'react';
import { Button } from '../form/button/button.tsx';
import { IconButton } from '../form/icon-button/icon-button.tsx';
import { Icon } from '../icon/icon.tsx';
import { ToastPositionContext, type ToastPosition } from './toast-position.ts';
import type { ToastData } from './use-toast.ts';

type ToastProviderProps = {
  /** How long a toast stays, in milliseconds. `0` keeps it until closed. */
  timeout?: number;
  /** How many toasts show at once; older ones hide until newer ones close. */
  limit?: number;
  children?: ReactNode;
};

/**
 * Shows the toasts that `useToast` adds, stacked at the bottom center of the
 * viewport with the newest at the bottom. Wrap the app in it once.
 * `useToastPosition` moves them, e.g. above another bar at the bottom.
 */
export function ToastProvider({
  timeout,
  limit,
  children,
}: ToastProviderProps) {
  const [position, setPosition] = useState<ToastPosition | null>(null);

  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      <ToastPositionContext value={setPosition}>
        {children}
      </ToastPositionContext>
      <ToastViewport position={position} />
    </BaseToast.Provider>
  );
}

function ToastViewport({ position }: { position: ToastPosition | null }) {
  const { toasts } = BaseToast.useToastManager<ToastData>();

  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        style={{
          left: position?.left ?? '50%',
          bottom: position?.bottom ?? '1.5rem',
        }}
        className={cn(
          // The first toast is the newest, so the stack grows upwards from it.
          'fixed z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col-reverse items-center gap-2 outline-none',
          // Glides when its position changes, e.g. as a bar below appears.
          'transition-[bottom] duration-200 ease-out motion-reduce:transition-none',
        )}
      >
        {toasts.map((toast) => (
          <ToastRoot key={toast.id} toast={toast} />
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

function ToastRoot({ toast }: { toast: ToastObject<ToastData> }) {
  const data = toast.data;
  const custom = data?.children !== undefined;

  return (
    <BaseToast.Root
      toast={toast}
      swipeDirection="down"
      className={cn(
        'border-border flex w-(--toast-width) max-w-full items-center gap-6 border bg-white bg-clip-padding shadow-lg dark:bg-mauve-900',
        // Like a bar of buttons: as tall as one, with room for the text on the left.
        !custom && 'py-1.5 pr-1.5 pl-5',
        // Custom content runs to the edges; `<Inset>` pads it by as much as the text.
        custom && '[--inset:1.25rem]',
        'translate-x-(--toast-swipe-movement-x) translate-y-(--toast-swipe-movement-y)',
        'transition-[opacity,translate] duration-150 ease-out motion-reduce:transition-none',
        'data-starting-style:translate-y-3 data-starting-style:opacity-0',
        'data-ending-style:translate-y-3 data-ending-style:opacity-0',
        'data-limited:hidden',
      )}
    >
      {custom ? (
        <BaseToast.Content className="min-w-0 flex-1">
          {data.children}
        </BaseToast.Content>
      ) : (
        <>
          <BaseToast.Content className="flex min-w-0 flex-1 flex-col py-2">
            <BaseToast.Title className="type-body-md m-0 text-mauve-950 dark:text-mauve-50" />
            {toast.description != null && (
              <BaseToast.Description className="type-body-sm m-0 text-mauve-600 dark:text-mauve-400" />
            )}
          </BaseToast.Content>
          <div className="flex shrink-0 gap-1">
            {toast.actionProps && (
              <BaseToast.Action
                render={<Button type="button" variant="tertiary" />}
              />
            )}
            <BaseToast.Close
              render={
                <IconButton variant="tertiary" aria-label="Dismiss">
                  <Icon icon={CloseLine} />
                </IconButton>
              }
            />
          </div>
        </>
      )}
    </BaseToast.Root>
  );
}
