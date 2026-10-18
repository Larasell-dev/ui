import type { ComponentProps } from 'react';
import { alignment, type Align, type Justify } from '../alignment.ts';
import { spacing, type Spacing } from '../spacing.ts';

type InlineProps = Omit<ComponentProps<'div'>, 'className' | 'style'> & {
  spacing: Spacing;
  /** Vertical alignment of the children. Defaults to stretching them to the tallest one. */
  align?: Align;
  /** Horizontal distribution of the children, e.g. `between` to push them to both ends. */
  justify?: Justify;
};

export function Inline({
  spacing: space,
  align,
  justify,
  ...props
}: InlineProps) {
  return (
    <div
      {...props}
      className="flex flex-row"
      style={{ gap: spacing(space), ...alignment(align, justify) }}
    />
  );
}
