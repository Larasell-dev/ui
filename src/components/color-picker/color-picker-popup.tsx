import { Popover } from '@base-ui/react/popover';
import { Slider } from '@base-ui/react/slider';
import { AnimatePresence } from 'motion/react';
import {
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import FileCopyLine from '@iconify-icons/ri/file-copy-line';
import CheckLine from '@iconify-icons/ri/check-line';
import { cn } from 'cn';
import { Icon } from '../icon/icon.tsx';
import { buttonColors } from '../form/button/button.tsx';
import { PopupMotion } from '../../utils/popup-motion.tsx';
import { collisionPadding } from '../../utils/collision-padding.ts';
import { useCopy } from '../../utils/use-copy.ts';
import {
  hexToRgb,
  hslToRgb,
  hsvToRgb,
  isHex,
  lchToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToLch,
  type Rgb,
} from './color.ts';
import {
  useColorPicker,
  type ColorPickerState,
} from './color-picker-context.ts';

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const round = (n: number, digits = 1) => String(Number(n.toFixed(digits)));
const CHECKER =
  'repeating-conic-gradient(#8884 0% 25%, transparent 0% 50%) 0 0 / 8px 8px';

type ColorPickerPopupProps = Pick<
  Popover.Positioner.Props,
  'side' | 'align'
> & {
  /** Without children: the area, alpha and hue sliders, a preview and the LCH, HSL, RGB and hex rows. */
  children?: ReactNode | ((state: ColorPickerState) => ReactNode);
};

/** The popup the trigger opens, animated like the other popups. */
export function ColorPickerPopup({
  side = 'bottom',
  align = 'start',
  children,
}: ColorPickerPopupProps) {
  const { value, open } = useColorPicker('Popup');

  return (
    <AnimatePresence>
      {open && (
        <Popover.Portal keepMounted>
          <Popover.Positioner
            side={side}
            align={align}
            sideOffset={4}
            collisionPadding={collisionPadding()}
            className="outline-none data-anchor-hidden:invisible"
          >
            <Popover.Popup
              render={(props, state) => (
                <PopupMotion {...props} side={state.side} />
              )}
              className="border-base-subtle bg-base-elevated shadow-popover border bg-clip-padding p-3 outline-none"
            >
              {typeof children === 'function'
                ? children({ value, open })
                : (children ?? (
                    <div
                      // One height for both sides: the area stays square, the preview fills the rest.
                      className="flex h-72 gap-3"
                    >
                      <ColorPickerArea />
                      <ColorPickerAlphaSlider />
                      <ColorPickerHueSlider />
                      <div className="flex w-64 flex-col gap-2">
                        <ColorPickerPreview />
                        <ColorPickerInputs />
                      </div>
                    </div>
                  ))}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      )}
    </AnimatePresence>
  );
}

/** The colour over a checkerboard, so its alpha shows. */
export function ColorPickerPreview() {
  const { value } = useColorPicker('Preview');
  return (
    <div
      aria-hidden
      className="border-base-subtle h-16 border"
      style={{ background: CHECKER }}
    >
      <div
        className="size-full"
        style={{ backgroundColor: value || undefined }}
      />
    </div>
  );
}

/** Picks saturation, left to right, and brightness, bottom to top, of the current hue. */
export function ColorPickerArea({
  'aria-label': ariaLabel,
}: {
  'aria-label'?: string;
}) {
  const { hsv, alpha, setColor, labels } = useColorPicker('Area');
  const label = ariaLabel ?? labels.area;

  const pick = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setColor(
      {
        h: hsv.h,
        s: clamp(((event.clientX - box.left) / box.width) * 100, 0, 100),
        v: clamp(100 - ((event.clientY - box.top) / box.height) * 100, 0, 100),
      },
      alpha,
    );
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;
    const move = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowDown: [0, -step],
      ArrowUp: [0, step],
    }[event.key];
    if (!move) return;
    event.preventDefault();
    setColor(
      {
        h: hsv.h,
        s: clamp(hsv.s + move[0]!, 0, 100),
        v: clamp(hsv.v + move[1]!, 0, 100),
      },
      alpha,
    );
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={Math.round(hsv.s)}
      aria-valuetext={`Saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%`}
      className="focus-visible:focus-ring relative size-72 shrink-0 cursor-crosshair touch-none outline-none"
      style={{
        backgroundColor: `hsl(${hsv.h} 100% 50%)`,
        backgroundImage:
          'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        pick(event);
      }}
      onPointerMove={(event) =>
        event.currentTarget.hasPointerCapture(event.pointerId) && pick(event)
      }
      onKeyDown={onKeyDown}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute size-4 -translate-1/2 rounded-full border-2"
        style={{
          left: `${hsv.s}%`,
          top: `${100 - hsv.v}%`,
          backgroundColor: rgbToHex(hsvToRgb(hsv)),
          // White in both themes: it rings a colour, not the page.
          borderColor: '#fff',
          boxShadow: '0 0 0 1px rgb(0 0 0 / 0.3)',
        }}
      />
    </div>
  );
}

function VerticalSlider({
  label,
  value,
  max,
  background,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  background: string;
  onChange: (value: number) => void;
}) {
  return (
    <Slider.Root
      className="h-full"
      value={value}
      min={0}
      max={max}
      largeStep={10}
      orientation="vertical"
      onValueChange={(next) => onChange(next as number)}
    >
      {/* The gradient spans the whole bar; the thumb travels an inset track half its height
          from each end, so it never reaches past the bar. */}
      <div
        className="border-base-subtle relative h-full w-6 border"
        style={{ background, backgroundOrigin: 'border-box' }}
      >
        <Slider.Control className="absolute inset-x-0 inset-y-1 flex touch-none justify-center">
          <Slider.Track className="h-full w-full">
            <Slider.Thumb
              aria-label={label}
              className="has-focus-visible:focus-ring h-2 w-5 rounded-sm outline-none"
              style={{
                backgroundColor: '#fff',
                boxShadow: '0 0 0 1px rgb(0 0 0 / 0.3)',
              }}
            />
          </Slider.Track>
        </Slider.Control>
      </div>
    </Slider.Root>
  );
}

/** Picks the hue, keeping saturation, brightness and alpha. */
export function ColorPickerHueSlider({
  'aria-label': ariaLabel,
}: {
  'aria-label'?: string;
}) {
  const { hsv, alpha, setColor, labels } = useColorPicker('HueSlider');
  const label = ariaLabel ?? labels.hue;
  return (
    <VerticalSlider
      label={label}
      value={hsv.h}
      max={359}
      background="linear-gradient(to top, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
      onChange={(h) => setColor({ ...hsv, h }, alpha)}
    />
  );
}

/** Picks the alpha, opaque at the top. */
export function ColorPickerAlphaSlider({
  'aria-label': ariaLabel,
}: {
  'aria-label'?: string;
}) {
  const { hsv, alpha, setColor, labels } = useColorPicker('AlphaSlider');
  const label = ariaLabel ?? labels.alpha;
  const solid = rgbToHex(hsvToRgb(hsv));
  return (
    <VerticalSlider
      label={label}
      value={Math.round(alpha * 100)}
      max={100}
      background={`linear-gradient(to top, transparent, ${solid}), ${CHECKER}`}
      onChange={(a) => setColor(hsv, a / 100)}
    />
  );
}

/** The colour as OKLCH, HSL, RGB and hex with its alpha, each row with a copy button. */
export function ColorPickerInputs() {
  const { value, alpha, setValue, labels } = useColorPicker('Inputs');
  const hex = value || '#000000';
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const lch = rgbToLch(rgb);
  const a = alpha < 1 ? ` / ${Math.round(alpha * 100)}%` : '';
  const set = (next: Rgb) => setValue(rgbToHex(next, alpha));
  const num = (text: string, min: number, max: number) => {
    const n = Number(text);
    return text.trim() !== '' && Number.isFinite(n) && n >= min && n <= max
      ? n
      : null;
  };

  return (
    <div className="flex flex-col gap-2">
      <Row
        copyLabel={labels.copyLch}
        copyText={`oklch(${round(lch.l)}% ${round(lch.c, 3)} ${round(lch.h)}${a})`}
        cells={[
          {
            label: labels.lchLightness,
            short: 'L',
            value: round(lch.l),
            set: (t) => {
              const n = num(t, 0, 100);
              if (n !== null) set(lchToRgb({ ...lch, l: n }));
            },
          },
          {
            label: labels.lchChroma,
            short: 'C',
            value: round(lch.c, 3),
            set: (t) => {
              const n = num(t, 0, 0.5);
              if (n !== null) set(lchToRgb({ ...lch, c: n }));
            },
          },
          {
            label: labels.lchHue,
            short: 'H',
            value: round(lch.h),
            set: (t) => {
              const n = num(t, 0, 360);
              if (n !== null) set(lchToRgb({ ...lch, h: n }));
            },
          },
        ]}
      />
      <Row
        copyLabel={labels.copyHsl}
        copyText={`hsl(${round(hsl.h)} ${round(hsl.s)}% ${round(hsl.l)}%${a})`}
        cells={[
          {
            label: labels.hslHue,
            short: 'H',
            value: round(hsl.h),
            set: (t) => {
              const n = num(t, 0, 360);
              if (n !== null) set(hslToRgb({ ...hsl, h: n }));
            },
          },
          {
            label: labels.hslSaturation,
            short: 'S',
            value: round(hsl.s),
            set: (t) => {
              const n = num(t, 0, 100);
              if (n !== null) set(hslToRgb({ ...hsl, s: n }));
            },
          },
          {
            label: labels.hslLightness,
            short: 'L',
            value: round(hsl.l),
            set: (t) => {
              const n = num(t, 0, 100);
              if (n !== null) set(hslToRgb({ ...hsl, l: n }));
            },
          },
        ]}
      />
      <Row
        copyLabel={labels.copyRgb}
        copyText={`rgb(${rgb.r} ${rgb.g} ${rgb.b}${a})`}
        cells={(['r', 'g', 'b'] as const).map((key, i) => ({
          label: [labels.red, labels.green, labels.blue][i]!,
          short: key.toUpperCase(),
          value: String(rgb[key]),
          set: (t: string) => {
            const n = num(t, 0, 255);
            if (n !== null && Number.isInteger(n)) set({ ...rgb, [key]: n });
          },
        }))}
      />
      <Row
        copyLabel={labels.copyHex}
        copyText={hex}
        cells={[
          {
            label: labels.hex,
            value: hex.slice(1, 7).toUpperCase(),
            wide: true,
            set: (t) => {
              const text = `#${t.trim().replace(/^#/, '')}`;
              if (isHex(text))
                setValue(
                  text.length === 9 ? text : rgbToHex(hexToRgb(text), alpha),
                );
            },
          },
          {
            label: labels.alphaPercentage,
            value: `${Math.round(alpha * 100)}%`,
            set: (t) => {
              const n = num(t.replace('%', ''), 0, 100);
              if (n !== null) setValue(rgbToHex(rgb, n / 100));
            },
          },
        ]}
      />
    </div>
  );
}

type CellProps = {
  label: string;
  short?: string;
  value: string;
  wide?: boolean;
  set: (text: string) => void;
};

/**
 * One colour space: its fields joined like a ButtonGroup, sharing their borders, with
 * their short labels below, outside the borders, and a copy button as tall as the fields.
 */
function Row({
  cells,
  copyLabel,
  copyText,
}: {
  cells: CellProps[];
  copyLabel: string;
  copyText: string;
}) {
  const { copied, copy } = useCopy();
  const grow = (cell: CellProps) => (cell.wide ? 'flex-[2]' : 'flex-1');

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <div className="flex min-w-0 flex-1">
          {cells.map((cell) => (
            <Cell key={cell.label} {...cell} className={grow(cell)} />
          ))}
        </div>
        <button
          type="button"
          aria-label={copyLabel}
          className={cn(
            buttonColors({ variant: 'tertiary' }),
            'focus-visible:focus-ring flex size-8 shrink-0 items-center justify-center outline-none',
          )}
          onClick={() => void copy(copyText)}
        >
          <Icon icon={copied ? CheckLine : FileCopyLine} />
        </button>
      </div>
      {cells.some((cell) => cell.short) && (
        <div aria-hidden className="flex gap-2">
          <div className="flex min-w-0 flex-1">
            {cells.map((cell) => (
              <span
                key={cell.label}
                className={cn(
                  grow(cell),
                  'type-label-sm text-base-secondary text-center',
                )}
              >
                {cell.short}
              </span>
            ))}
          </div>
          <span className="w-8 shrink-0" />
        </div>
      )}
    </div>
  );
}

/** A text field that commits on Enter or blur, and shows the value again if it wasn't taken. */
function Cell({
  label,
  value,
  set,
  className,
}: CellProps & { className: string }) {
  const [text, setText] = useState(value);
  const [seen, setSeen] = useState(value);
  if (seen !== value) {
    setSeen(value);
    setText(value);
  }
  const commit = () => {
    set(text);
    setText(value);
  };

  return (
    <input
      aria-label={label}
      value={text}
      autoComplete="off"
      spellCheck={false}
      className={cn(
        className,
        // Neighbours overlap by their 1px border, as in a ButtonGroup; the focused one paints on top.
        'border-base-strong bg-base-surface text-base-primary type-body-sm focus:focus-ring relative -ml-px h-8 min-w-0 border px-1 text-center outline-none first:ml-0 focus:z-10',
      )}
      onChange={(event) => setText(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        commit();
      }}
    />
  );
}
