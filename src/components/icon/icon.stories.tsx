import preview from '../../../.storybook/preview.tsx';
import * as icons from '../../icons.ts';
import { spacingScale } from '../layout/spacing.ts';
import { Icon } from './icon.tsx';

// Args hold an export name so the select control shows it; `mapping` turns
// the name into the icon before rendering.
function option(name: keyof typeof icons) {
  return name as unknown as (typeof icons)[typeof name];
}

const meta = preview.meta({
  title: 'Atoms/Icon',
  component: Icon,
  // The Docs page is where Storybook shows the prop descriptions below.
  tags: ['autodocs'],
  args: {
    icon: option('HomeLine'),
  },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(icons),
      mapping: icons,
      description:
        "A [Remix Icon](https://remixicon.com) imported from `@larasell-dev/ui/icons`, e.g. `import { HomeLine } from '@larasell-dev/ui/icons'`. Only the icons an app imports end up in its bundle.",
      table: { type: { summary: 'IconifyIcon' } },
    },
    label: {
      control: 'text',
      description:
        'Accessible name for a MEANINGFUL, standalone icon (a status glyph or icon-only indicator with no adjacent text). Setting it exposes the icon to screen readers as `role="img"` with this text as the accessible name (`aria-label`) and removes the default `aria-hidden`. Omit it (default) for decorative icons and the icon stays hidden from assistive tech (`aria-hidden="true"`). This is the accessible-name / alt-text prop for icons: one prop instead of manually setting `aria-label` + `role` + `aria-hidden`. An empty string is treated as decorative. Do not set it when an interactive parent (Button, link) already names the control.',
    },
    size: {
      control: 'select',
      options: spacingScale,
      description:
        'Width and height on the Tailwind spacing scale, like the `size-*` utilities: `4` is `size-4`, 16px by default. Omit it (default) and the icon is 1em square, so it matches the size of the surrounding text.',
    },
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <span className="text-2xl text-mauve-950 dark:text-mauve-100">
      <Icon {...args} />
    </span>
  ),
});

export const Default = meta.story({});

export const Labelled = meta.story({
  args: {
    icon: option('ErrorWarningLine'),
    label: 'Error',
  },
});

export const Sized = meta.story({
  args: {
    size: 4,
  },
});

export const InheritsTextStyle = meta.story({
  args: {
    icon: option('MailLine'),
  },
  render: (args) => (
    <p className="type-label-md flex items-center gap-2 text-red-600 dark:text-red-400">
      <Icon {...args} />
      Couldn't send the email
    </p>
  ),
});
