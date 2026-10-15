import type { ComponentProps } from 'react';
import { spacing, type Spacing } from '../spacing.ts';

type SpacerProps = Omit<
  ComponentProps<'div'>,
  'className' | 'style' | 'children'
> & {
  spacing: Spacing;
  axis?: 'vertical' | 'horizontal';
};

export function Spacer({
  spacing: space,
  axis = 'vertical',
  ...props
}: SpacerProps) {
  return (
    <div
      aria-hidden
      {...props}
      className="shrink-0"
      style={
        axis === 'vertical'
          ? { height: spacing(space) }
          : { width: spacing(space) }
      }
    />
  );
}
