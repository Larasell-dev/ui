import type { IconifyIcon } from '@iconify/types';

type IconProps = {
  /**
   * Remix icon to render, imported from `@larasell-dev/ui/icons`, e.g.
   * `import { RiHomeLine } from '@larasell-dev/ui/icons'`.
   */
  icon: IconifyIcon;
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

export function Icon({ icon, label }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${icon.width ?? 16} ${icon.height ?? 16}`}
      width="1em"
      height="1em"
      role="img"
      {...(label ? { 'aria-label': label } : { 'aria-hidden': true })}
      // Trusted SVG markup from the pinned @iconify-icons/ri package.
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
