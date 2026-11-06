import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';

type TruncateMiddleProps = {
  /** The text; plain text only, since it is cut by characters. */
  children: string;
};

/**
 * Text that keeps its start and end and cuts the middle when it doesn't fit,
 * e.g. `shop.example…/en/` for a URL, where both ends tell entries apart. It
 * is as wide as its text, shrinks with its container, and fits again on
 * resize. Screen readers get the whole text; `<Tooltip.Truncated>` shows it.
 *
 * Unlike Tailwind's `truncate`, which cuts the end, this needs JavaScript: it
 * measures the text to find how much of each end fits.
 */
export function TruncateMiddle({ children: text }: TruncateMiddleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);

  useLayoutEffect(() => {
    const element = ref.current;
    const ruler = measure.current;

    if (!element || !ruler) {
      return;
    }

    // Fractional widths on both sides: clientWidth rounds, which would cut
    // text that fits by less than a pixel.
    const fits = (candidate: string) => {
      ruler.textContent = candidate;
      return (
        ruler.getBoundingClientRect().width <=
        element.getBoundingClientRect().width
      );
    };

    const fit = () => {
      if (fits(text)) {
        setShown(text);
        return;
      }

      // The most characters that still fit with the ellipsis, half from each
      // end, found by halving the range instead of trying every length.
      let [low, high] = [0, Array.from(text).length - 1];

      while (low < high) {
        const kept = Math.ceil((low + high) / 2);

        if (fits(cut(text, kept))) {
          low = kept;
        } else {
          high = kept - 1;
        }
      }

      setShown(cut(text, low));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);

    return () => observer.disconnect();
  }, [text]);

  const truncated = shown !== text;

  return (
    <span
      ref={ref}
      data-truncate-middle=""
      data-truncated={truncated ? '' : undefined}
      data-full-text={text}
      // Inline, not classes: the measuring depends on this layout, so a
      // stylesheet must not change it.
      style={box}
    >
      {/* Gives the box the whole text's width, so it grows back once there's
          room again; it never shows. */}
      <span aria-hidden="true" style={sizer}>
        {text}
      </span>
      <span aria-hidden="true" style={visible}>
        {shown}
      </span>
      <span ref={measure} aria-hidden="true" style={ruler} />
      <span style={visuallyHidden}>{text}</span>
    </span>
  );
}

/**
 * The text with `kept` characters, the extra one at the start, around "…".
 * Characters are code points, so an emoji is never cut in half.
 */
function cut(text: string, kept: number): string {
  const characters = Array.from(text);
  const start = Math.ceil(kept / 2);

  return `${characters.slice(0, start).join('')}…${characters.slice(characters.length - (kept - start)).join('')}`;
}

const box: CSSProperties = {
  position: 'relative',
  display: 'block',
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
  whiteSpace: 'pre',
};

const sizer: CSSProperties = {
  display: 'block',
  height: 0,
  visibility: 'hidden',
};

const visible: CSSProperties = { display: 'block' };

const ruler: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  whiteSpace: 'pre',
};

const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
};
