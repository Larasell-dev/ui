import { Dialog } from '@base-ui/react/dialog';
import CloseLine from '@iconify-icons/ri/close-line';
import type { ReactNode } from 'react';
import { IconButton } from '../form/icon-button/icon-button.tsx';
import { Icon } from '../icon/icon.tsx';

type SlideoverHeaderProps = {
  /** Names the slideover, e.g. "Add address". */
  title: ReactNode;
  /** What the slideover is for. */
  description?: ReactNode;
  /** Accessible name of the close button. Defaults to "Close". */
  closeLabel?: string;
};

/** The title, an optional description and a button that closes the slideover. */
export function SlideoverHeader({
  title,
  description,
  closeLabel = 'Close',
}: SlideoverHeaderProps) {
  return (
    <div className="flex shrink-0 items-start gap-4 px-6 pt-6 pb-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Dialog.Title className="type-headline-md text-base-primary m-0 text-balance">
          {title}
        </Dialog.Title>
        {description != null && (
          <Dialog.Description className="type-body-md text-base-secondary m-0 text-pretty">
            {description}
          </Dialog.Description>
        )}
      </div>
      <Dialog.Close
        render={
          <IconButton variant="tertiary" size="sm" aria-label={closeLabel}>
            <Icon icon={CloseLine} />
          </IconButton>
        }
      />
    </div>
  );
}
