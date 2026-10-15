import type { ComponentProps } from 'react';
import { spacing, type Spacing } from '../spacing.ts';

type StackProps = Omit<ComponentProps<'div'>, 'className' | 'style'> & {
  spacing: Spacing;
};

export function Stack({ spacing: space, ...props }: StackProps) {
  return (
    <div {...props} className="flex flex-col" style={{ gap: spacing(space) }} />
  );
}
