import type { ComponentProps } from 'react';
import { spacing, type Spacing } from '../spacing.ts';

type InlineProps = Omit<ComponentProps<'div'>, 'className' | 'style'> & {
  spacing: Spacing;
};

export function Inline({ spacing: space, ...props }: InlineProps) {
  return (
    <div {...props} className="flex flex-row" style={{ gap: spacing(space) }} />
  );
}
