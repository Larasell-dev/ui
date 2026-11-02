import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import preview from '../../../.storybook/preview.tsx';
import { Button } from '../form/button/button.tsx';
import { Inset } from '../layout/inset/inset.tsx';
import { useToastPosition } from './toast-position.ts';
import { ToastProvider } from './toast-provider.tsx';
import { type ToastOptions, useToast } from './use-toast.ts';

const meta = preview.meta({
  title: 'Molecules/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div style={{ minHeight: '100vh', padding: 32 }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
});

/** A button that adds a toast with the options on every click. */
function AddToast({
  options,
  children,
}: {
  options: ToastOptions;
  children: string;
}) {
  const toast = useToast();
  return (
    <Button variant="secondary" onClick={() => toast.add(options)}>
      {children}
    </Button>
  );
}

/** Adds the toasts once, when the story loads. */
function ShowOnLoad({ toasts }: { toasts: ToastOptions[] }) {
  const toast = useToast();
  useEffect(() => {
    // Ids, so React's second effect in strict mode updates them instead of adding them twice.
    const ids = toasts.map((options, index) =>
      toast.add({ id: `on-load-${index}`, ...options }),
    );
    return () => ids.forEach((id) => toast.close(id));
  }, [toast, toasts]);
  return null;
}

/** `useToast().add` shows a toast for five seconds, or until it's dismissed. */
export const Default = meta.story({
  render: () => (
    <AddToast options={{ title: 'Product saved' }}>Show toast</AddToast>
  ),
});

/** Shown on load and kept, to review the toast on its own. */
export const Shown = meta.story({
  render: () => (
    <ShowOnLoad toasts={[{ title: 'Product saved', timeout: 0 }]} />
  ),
});

/** A description adds detail below the title. */
export const WithDescription = meta.story({
  render: () => (
    <ShowOnLoad
      toasts={[
        {
          title: "That image isn't on this product anymore",
          description: 'It may have been removed since the link was shared.',
          timeout: 0,
        },
      ]}
    />
  ),
});

/** An action button sits beside the dismiss button, e.g. to undo. */
export const WithAction = meta.story({
  render: () => (
    <ShowOnLoad
      toasts={[
        {
          title: '3 products deleted',
          actionProps: { children: 'Undo' },
          timeout: 0,
        },
      ]}
    />
  ),
});

/** Toasts stack upwards, with the newest at the bottom. */
export const Stacked = meta.story({
  render: () => (
    <ShowOnLoad
      toasts={[
        { title: 'Product saved', timeout: 0 },
        { title: 'Image uploaded', timeout: 0 },
        { title: 'Category moved', timeout: 0 },
      ]}
    />
  ),
});

/**
 * Like the admin's unsaved changes toast: a bar at the bottom center. While
 * it shows, `useToastPosition` moves the toasts above it, and back down once
 * it's gone.
 */
function UnsavedChangesBar({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="border-border bg-elevated shadow-elevated flex w-(--toast-width) max-w-full items-center justify-between gap-6 border bg-clip-padding py-1.5 pr-1.5 pl-5">
      <p className="type-body-md m-0 whitespace-nowrap text-mauve-950 dark:text-mauve-50">
        Unsaved changes
      </p>
      <div className="flex gap-1">
        <Button variant="tertiary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onCancel}>Save</Button>
      </div>
    </div>
  );
}

function AboveABarDemo() {
  const [dirty, setDirty] = useState(true);
  const bar = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);

  useEffect(() => {
    const element = bar.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setBarHeight(element.offsetHeight),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [dirty]);

  // Where the bar sits, and the toasts with it; above it while it shows.
  useToastPosition({
    left: '50%',
    bottom: dirty ? `calc(1.5rem + ${barHeight}px + 0.5rem)` : '1.5rem',
  });

  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <AddToast options={{ title: 'Image uploaded' }}>Show toast</AddToast>
        <Button variant="secondary" onClick={() => setDirty(!dirty)}>
          {dirty ? 'Hide the bar' : 'Show the bar'}
        </Button>
      </div>
      <ShowOnLoad toasts={[{ title: 'Image uploaded', timeout: 0 }]} />
      {dirty && (
        <div
          ref={bar}
          className="z-docked fixed bottom-6 left-1/2 -translate-x-1/2"
        >
          <UnsavedChangesBar onCancel={() => setDirty(false)} />
        </div>
      )}
    </>
  );
}

/**
 * `useToastPosition` puts the toasts above a bar like the admin's unsaved
 * changes toast. They glide up when it appears and down when it goes.
 */
export const AboveABar = meta.story({
  render: () => <AboveABarDemo />,
});

/**
 * Adding a toast that's already shown, by `id` or by the same title and
 * description, bumps it and restarts its timeout instead of stacking a copy.
 * Click a few times.
 */
export const Deduplicated = meta.story({
  render: () => (
    <AddToast options={{ title: 'Product saved' }}>Save product</AddToast>
  ),
});

/** `bump: false` still dedupes and restarts the timeout, but keeps still. */
export const DeduplicatedWithoutBump = meta.story({
  render: () => (
    <AddToast options={{ title: 'Product saved', bump: false }}>
      Save product
    </AddToast>
  ),
});

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <Inset>
      <div className="flex items-center justify-between gap-6">
        <p className="type-body-md m-0 text-mauve-950 dark:text-mauve-50">
          Clicked {count} times
        </p>
        <Button variant="tertiary" onClick={() => setCount(count + 1)}>
          Click
        </Button>
      </div>
    </Inset>
  );
}

/**
 * `children` replace the title, description and buttons and render the whole
 * toast, padded by `<Inset>`. They can keep their own state: click, then add
 * the toast again and the count stays.
 */
export const CustomContent = meta.story({
  render: () => (
    <AddToast options={{ id: 'counter', children: <Counter />, timeout: 0 }}>
      Show toast
    </AddToast>
  ),
});

/**
 * Without `<Inset>`, custom content touches the toast's edges, e.g. for an
 * image. `<Inset>` pads only the parts that need it.
 */
export const CustomContentToTheEdges = meta.story({
  render: () => (
    <ShowOnLoad
      toasts={[
        {
          timeout: 0,
          children: (
            <div className="flex items-stretch">
              <div className="w-20 shrink-0 bg-mauve-200 dark:bg-mauve-700" />
              <Inset>
                <div className="flex flex-col gap-1">
                  <p className="type-body-md m-0 text-mauve-950 dark:text-mauve-50">
                    Image uploaded
                  </p>
                  <div className="h-1 w-48 bg-mauve-950 dark:bg-mauve-50" />
                </div>
              </Inset>
            </div>
          ),
        },
      ]}
    />
  ),
});

const sizes = ['Small', 'Medium', 'Large'];
const sizeListeners = new Set<() => void>();
let size = 0;

/** Custom content that follows outside state and animates the word that changes. */
function SizeChanged() {
  const current = useSyncExternalStore(
    (listener) => {
      sizeListeners.add(listener);
      return () => sizeListeners.delete(listener);
    },
    () => size,
  );
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, bounce: 0.1, visualDuration: 0.3 };
  // Each change gets its own key, so the word always spawns a new element that rises in, even
  // when it comes back while its previous element is still on its way out.
  const [shown, setShown] = useState({ current, change: 0 });
  if (shown.current !== current)
    setShown({ current, change: shown.change + 1 });

  return (
    <Inset>
      <p className="type-body-md m-0 flex text-mauve-950 dark:text-mauve-50">
        Changed size to&nbsp;
        <span className="relative inline-flex overflow-y-clip">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={shown.change}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={transition}
            >
              {sizes[shown.current]}
            </motion.span>
          </AnimatePresence>
        </span>
      </p>
    </Inset>
  );
}

function ChangeSize() {
  const toast = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => {
        size = (size + 1) % sizes.length;
        sizeListeners.forEach((listener) => listener());
        toast.add({ id: 'size', children: <SizeChanged />, bump: false });
      }}
    >
      Change size
    </Button>
  );
}

/**
 * Like the admin's theme toast: every change adds the toast again without a
 * bump, and the content swaps the word it shows.
 */
export const CustomContentFollowingState = meta.story({
  render: () => <ChangeSize />,
});
