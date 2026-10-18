import type { IconifyIcon } from '@iconify/types';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from 'cn';
import { Icon } from '../icon/icon.tsx';
import { Inline } from '../layout/inline/inline.tsx';
import { Stack } from '../layout/stack/stack.tsx';

type EmptyStateProps = {
  /**
   * What the user is looking at, phrased around why it is empty rather than
   * just that it is, e.g. "No customers yet" or "No orders match your
   * filters". Avoid a bare "No data".
   */
  title: string;
  /**
   * Remix icon that hints at the missing content, imported from
   * `@larasell-dev/ui/icons`, e.g. `GroupLine` for customers. Decorative and
   * hidden from assistive tech.
   */
  icon?: IconifyIcon;
  /**
   * Explains why there is nothing here and what changes that. Pick the case
   * that applies:
   *
   * - **First use / onboarding**: nothing exists yet. Explain what the page
   *   is for and how content gets here, e.g. "Customers appear here after
   *   their first order."
   * - **User cleared it**: the user finished or removed everything. Confirm
   *   that this is a good outcome, e.g. "You've handled all contact requests."
   * - **No results**: a search or filter matched nothing. Say so and suggest
   *   broadening it, e.g. "Try a different search term or clear the filters."
   * - **No access or error**: content exists but can't be shown. Say why and
   *   who can help, instead of pretending there is nothing.
   */
  description?: ReactNode;
  /**
   * Actions that resolve the empty state, usually one primary `Button`
   * (e.g. "Add product", "Clear filters") and optionally a secondary one or
   * a documentation link. Leave it out when the user can't do anything about
   * it, such as data that arrives on its own.
   */
  children?: ReactNode;
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
};

/**
 * Shown in place of content that doesn't exist yet or can't be shown, such
 * as an empty table or list. A good empty state explains why there is
 * nothing here and offers a way forward; see
 * https://design.gitlab.com/patterns/empty-states/.
 */
export function EmptyState({
  title,
  icon,
  description,
  children,
  DANGEROUS_className,
  DANGEROUS_style,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'mx-auto max-w-md px-6 py-12 text-center',
        DANGEROUS_className,
      )}
      style={DANGEROUS_style}
    >
      <Stack spacing={6} align="center">
        <Stack spacing={4} align="center">
          {icon && (
            <span className="flex text-4xl text-mauve-600 dark:text-mauve-300">
              <Icon icon={icon} />
            </span>
          )}
          <Stack spacing={2}>
            <h2 className="type-body-lg font-semibold text-mauve-950 dark:text-mauve-50">
              {title}
            </h2>
            {description != null && (
              <p className="type-body-md text-mauve-600 dark:text-mauve-400">
                {description}
              </p>
            )}
          </Stack>
        </Stack>
        {children != null && <Inline spacing={3}>{children}</Inline>}
      </Stack>
    </div>
  );
}
