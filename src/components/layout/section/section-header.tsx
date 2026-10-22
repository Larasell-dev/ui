import { type ReactNode, useContext } from 'react';
import { SectionTitleId } from './section-root.tsx';

type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Shown on the right, e.g. a `<Button>`. */
  action?: ReactNode;
};

/** The section's title and description, flush with the content's edges, and an optional action on the right. */
export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    // Tall enough for a button in the action slot, so adding or removing one doesn't shift the content.
    <div className="flex min-h-10.5 items-end justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <h3
          id={useContext(SectionTitleId)}
          className="type-label-md text-mauve-950 dark:text-mauve-50"
        >
          {title}
        </h3>
        {description && (
          <p className="type-body-sm text-mauve-600 dark:text-mauve-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
