import type { IconifyIcon } from '@iconify/types';
import { cn } from 'cn';
import { Icon } from '../icon/icon.tsx';

type ThumbnailProps = (
  | {
      /** The picture to show, e.g. an avatar or a product photo. */
      src: string;
      icon?: never;
      /**
       * `round` for people, e.g. avatars; `square` (the default) for things,
       * e.g. product photos and logos.
       */
      shape?: 'round' | 'square';
    }
  | {
      /**
       * Remix icon to show instead of a picture, from `@larasell-dev/ui/icons`.
       * It shows as it is, in the text's colour, without a background or shape.
       */
      icon: IconifyIcon;
      src?: never;
      shape?: never;
    }
) & {
  /**
   * Names the thumbnail for assistive tech. Set it only when the thumbnail
   * says something the text next to it doesn't, e.g. "Company" beside a
   * name. Omit it (the default) when it only decorates that text, and it is
   * hidden from assistive tech.
   */
  alt?: string;
  /** Shown as a tooltip on hover. */
  title?: string;
};

/**
 * A small picture or icon shown before a value, e.g. in a `<Table.Cell>`'s
 * or `<DataList.Field>`'s `media`. It is as tall as a line of body text.
 */
export function Thumbnail({
  src,
  icon,
  alt,
  title,
  shape = 'square',
}: ThumbnailProps) {
  if (icon !== undefined) {
    return (
      <span
        title={title}
        className="flex size-[1lh] shrink-0 items-center justify-center"
      >
        <Icon icon={icon} label={alt} />
      </span>
    );
  }

  return (
    <span
      title={title}
      className={cn(
        'flex size-[1lh] shrink-0 overflow-hidden bg-mauve-100 dark:bg-mauve-800',
        shape === 'round' ? 'rounded-full' : 'rounded-md',
      )}
    >
      <img src={src} alt={alt ?? ''} className="size-full object-cover" />
    </span>
  );
}
