import type { ComponentType, SVGProps } from 'react';

type IconProps = {
  /**
   * Icon component compiled by `unplugin-icons`, e.g.
   * `import RiHomeLine from '~icons/ri/home-line'`.
   */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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

export function Icon({ icon: Svg, label }: IconProps) {
  return (
    <Svg
      role="img"
      width="1em"
      height="1em"
      {...(label ? { 'aria-label': label } : { 'aria-hidden': true })}
    />
  );
}
