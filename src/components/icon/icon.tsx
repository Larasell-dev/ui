import icons from '@iconify-json/ri/icons.json' with { type: 'json' };
import { addCollection, Icon as IconifyIcon } from '@iconify/react/offline';

addCollection(icons);

export type IconName = keyof (typeof icons)['icons'];

type IconProps = {
  /** Name of a [Remix Icon](https://remixicon.com), e.g. `home-line`. */
  name: IconName;
  /**
   * Accessible name for the icon. Set this only when the icon is meaningful
   * on its own, such as a standalone status glyph with no adjacent text
   * conveying the same information. Providing it exposes the icon to
   * assistive tech as `role="img"` with this string as its accessible name
   * (via `aria-label`) and drops the default `aria-hidden="true"`.
   *
   * Omit it (the default) for decorative icons, such as an icon beside a text
   * label, and the icon stays hidden from assistive tech. An empty string is
   * treated the same as omitting it.
   *
   * Don't set `label` when an interactive parent such as a button or link
   * already names the control; that produces a duplicate announcement.
   */
  label?: string;
};

export function Icon({ name, label }: IconProps) {
  return (
    <IconifyIcon
      icon={`ri:${name}`}
      {...(label ? { 'aria-label': label, 'aria-hidden': false } : {})}
    />
  );
}
