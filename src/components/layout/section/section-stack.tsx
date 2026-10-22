import type { ReactNode } from 'react';
import { Stack } from '../stack/stack.tsx';

/** Stacks sections with the space between them. */
export function SectionStack({ children }: { children: ReactNode }) {
  return <Stack spacing={16}>{children}</Stack>;
}
