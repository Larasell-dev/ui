import { useLayoutEffect, useRef, type ReactNode } from 'react';
import preview from '../../.storybook/preview.tsx';

const meta = preview.meta({
  title: 'Foundations/Scroll mask',
  parameters: {
    layout: 'padded',
  },
});

const moons = [
  'Ganymede',
  'Titan',
  'Callisto',
  'Io',
  'Luna',
  'Europa',
  'Triton',
  'Titania',
  'Oberon',
  'Rhea',
  'Iapetus',
  'Charon',
  'Umbriel',
  'Ariel',
  'Dione',
  'Tethys',
];

function Case({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="type-label-md text-mauve-950 dark:text-mauve-100">
        {title}
      </p>
      {children}
    </div>
  );
}

function List({ count = moons.length }: { count?: number }) {
  return moons.slice(0, count).map((moon, index) => (
    <div
      key={moon}
      className="type-body-md flex justify-between border-b border-mauve-100 px-3 py-2 text-mauve-950 last:border-b-0 dark:border-mauve-800 dark:text-mauve-100"
    >
      {moon}
      <span className="type-mono-sm text-mauve-500">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  ));
}

function Row() {
  return (
    <div className="flex w-max gap-2 p-3">
      {moons.map((moon) => (
        <span
          key={moon}
          className="type-label-md border border-mauve-200 px-3 py-1.5 text-mauve-950 dark:border-mauve-700 dark:text-mauve-100"
        >
          {moon}
        </span>
      ))}
    </div>
  );
}

const box =
  'border border-mauve-200 bg-white dark:border-mauve-700 dark:bg-mauve-900';

export const Vertical = meta.story({
  render: () => (
    <Case title="scroll-mask-y">
      <div className={`scroll-mask-y h-64 w-72 overflow-y-auto ${box}`}>
        <List />
      </div>
    </Case>
  ),
});

export const Horizontal = meta.story({
  render: () => (
    <Case title="scroll-mask-x">
      <div className={`scroll-mask-x max-w-md overflow-x-auto ${box}`}>
        <Row />
      </div>
    </Case>
  ),
});

export const SingleEdges = meta.story({
  render: () => (
    <div className="grid grid-cols-[repeat(2,max-content)] gap-8">
      <Case title="scroll-mask-t">
        <div className={`scroll-mask-t h-56 w-64 overflow-y-auto ${box}`}>
          <List />
        </div>
      </Case>
      <Case title="scroll-mask-b">
        <div className={`scroll-mask-b h-56 w-64 overflow-y-auto ${box}`}>
          <List />
        </div>
      </Case>
      <Case title="scroll-mask-l">
        <div className={`scroll-mask-l w-64 overflow-x-auto ${box}`}>
          <Row />
        </div>
      </Case>
      <Case title="scroll-mask-r">
        <div className={`scroll-mask-r w-64 overflow-x-auto ${box}`}>
          <Row />
        </div>
      </Case>
    </div>
  ),
});

export const CustomStops = meta.story({
  render: () => (
    <div className="flex flex-wrap gap-8">
      <Case title="scroll-mask-y (80%, default)">
        <div className={`scroll-mask-y h-56 w-56 overflow-y-auto ${box}`}>
          <List />
        </div>
      </Case>
      <Case title="scroll-mask-y-from-95%">
        <div
          className={`scroll-mask-y-from-95% h-56 w-56 overflow-y-auto ${box}`}
        >
          <List />
        </div>
      </Case>
      <Case title="scroll-mask-y-from-50%">
        <div
          className={`scroll-mask-y-from-50% h-56 w-56 overflow-y-auto ${box}`}
        >
          <List />
        </div>
      </Case>
      <Case title="scroll-mask-b-from-[180px]">
        <div
          className={`scroll-mask-b-from-[180px] h-56 w-56 overflow-y-auto ${box}`}
        >
          <List />
        </div>
      </Case>
    </div>
  ),
});

export const BothAxes = meta.story({
  render: () => (
    <Case title="scroll-mask-y scroll-mask-x">
      <div
        className={`scroll-mask-y scroll-mask-x h-64 max-w-md overflow-auto ${box}`}
      >
        {moons.slice(0, 10).map((moon) => (
          <Row key={moon} />
        ))}
      </div>
    </Case>
  ),
});

export const NoOverflow = meta.story({
  render: () => (
    <Case title="scroll-mask-y, content fits: no fade">
      <div className={`scroll-mask-y h-64 w-72 overflow-y-auto ${box}`}>
        <List count={4} />
      </div>
    </Case>
  ),
});

/** Sets --scroll-mask-scrollbar-width from the element's scrollbar. */
function useScrollbarWidth() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      element.style.setProperty(
        '--scroll-mask-scrollbar-width',
        // The strip is pinned to the outer edge, so it spans the right
        // border too; only the left border is subtracted.
        `${element.offsetWidth - element.clientWidth - element.clientLeft}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function KeptScrollbar() {
  const ref = useScrollbarWidth();
  return (
    <div
      ref={ref}
      className={`scroll-mask-y h-64 w-72 overflow-y-scroll ${box}`}
    >
      <List />
    </div>
  );
}

/**
 * Only visible with classic scrollbars (Windows, Linux, or macOS with
 * "Show scroll bars: Always"). Overlay scrollbars take no width, so there is
 * nothing to keep out of the fade.
 */
export const Scrollbar = meta.story({
  render: () => (
    <div className="flex flex-wrap gap-8">
      <Case title="Width not set: the scrollbar fades">
        <div className={`scroll-mask-y h-64 w-72 overflow-y-scroll ${box}`}>
          <List />
        </div>
      </Case>
      <Case title="--scroll-mask-scrollbar-width measured: it doesn't">
        <KeptScrollbar />
      </Case>
    </div>
  ),
});
