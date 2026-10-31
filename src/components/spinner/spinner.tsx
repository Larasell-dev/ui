import type { CSSProperties } from 'react';
import { cn } from 'cn';
import { Loader2Line } from '../../icons.ts';
import { Icon } from '../icon/icon.tsx';
import type { Spacing } from '../layout/spacing.ts';

type SpinnerProps = {
  /**
   * Accessible name announced by assistive tech. Defaults to "Loading".
   * Describe what is loading when the context doesn't, e.g. "Loading orders".
   */
  'aria-label'?: string;
  /**
   * Make the spinner purely decorative. Use it when something else already
   * conveys the busy state, such as a button with `aria-busy`. Interactive
   * elements can't contain a live region, so `Button` sets this.
   */
  'aria-hidden'?: boolean;
  /**
   * Width and height on the Tailwind spacing scale, like the `size-*`
   * utilities: `6` is `size-6`, 24px by default. Omit it and the spinner is
   * 1em square, so it matches the size of the surrounding text.
   */
  size?: Spacing;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * An indeterminate loading indicator. Sized by `size`, or by the surrounding
 * font size without it, and coloured with `currentColor`. The rotation stops for users who prefer
 * reduced motion.
 */
export function Spinner({
  'aria-label': label = 'Loading',
  'aria-hidden': hidden,
  size,
  DANGEROUS_className,
  DANGEROUS_style,
}: SpinnerProps) {
  return (
    <span
      {...(hidden
        ? { 'aria-hidden': true }
        : { role: 'status', 'aria-label': label })}
      className={cn(
        'inline-flex motion-safe:animate-spin',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      <Icon icon={Loader2Line} size={size} />
    </span>
  );
}
