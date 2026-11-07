import { type ReactNode, useContext } from 'react';
import { SectionTitleId } from './section-root.tsx';

type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** E.g. a `<Button>`. Sits beside the text while both fit, and wraps below it once they don't. */
  action?: ReactNode;
};

/** The section's title and description, flush with the content's edges, and an optional action. */
export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    // Tall enough for a button in the action slot, so adding or removing one doesn't shift the content.
    <div className="flex min-h-10.5 flex-wrap items-end justify-between gap-x-8 gap-y-4">
      {/* Grows to fill the row, and wraps the action below once it would get narrower than its basis. */}
      <div className="flex min-w-0 flex-1 basis-sm flex-col gap-0.5 [overflow-wrap:anywhere]">
        <h3
          id={useContext(SectionTitleId)}
          className="type-label-md text-base-primary"
        >
          {title}
        </h3>
        {description && (
          <p className="type-body-sm text-base-secondary">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
