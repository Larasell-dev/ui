import type { ComponentProps } from 'react';
import { alignment, type Align, type Justify } from '../alignment.ts';
import { spacing, type Spacing } from '../spacing.ts';

type StackProps = Omit<ComponentProps<'div'>, 'className' | 'style'> & {
  spacing: Spacing;
  /** Horizontal alignment of the children. Defaults to stretching them to full width. */
  align?: Align;
  /** Vertical distribution of the children. Only visible when the stack is taller than its content. */
  justify?: Justify;
};

export function Stack({
  spacing: space,
  align,
  justify,
  ...props
}: StackProps) {
  return (
    <div
      {...props}
      className="flex flex-col"
      style={{ gap: spacing(space), ...alignment(align, justify) }}
    />
  );
}
