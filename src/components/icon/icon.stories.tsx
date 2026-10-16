import RiErrorWarningLine from '~icons/ri/error-warning-line';
import RiHomeLine from '~icons/ri/home-line';
import RiMailLine from '~icons/ri/mail-line';
import preview from '../../../.storybook/preview.tsx';
import { Icon } from './icon.tsx';

const iconOptions = {
  RiHomeLine,
  RiErrorWarningLine,
  RiMailLine,
};

// Args hold an option key so the select control shows it; `mapping` turns
// the key into the component before rendering.
function option(key: keyof typeof iconOptions) {
  return key as unknown as (typeof iconOptions)[typeof key];
}

const meta = preview.meta({
  title: 'Atoms/Icon',
  component: Icon,
  // The Docs page is where Storybook shows the prop descriptions below.
  tags: ['autodocs'],
  args: {
    icon: option('RiHomeLine'),
  },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      description:
        "Icon component compiled by `unplugin-icons` from the [Remix Icon](https://remixicon.com) set, e.g. `import RiHomeLine from '~icons/ri/home-line'`.",
      table: { type: { summary: 'ComponentType<SVGProps<SVGSVGElement>>' } },
    },
    label: {
      control: 'text',
      description:
        'Accessible name for a MEANINGFUL, standalone icon (a status glyph or icon-only indicator with no adjacent text). Setting it exposes the icon to screen readers as `role="img"` with this text as the accessible name (`aria-label`) and removes the default `aria-hidden`. Omit it (default) for decorative icons and the icon stays hidden from assistive tech (`aria-hidden="true"`). This is the accessible-name / alt-text prop for icons: one prop instead of manually setting `aria-label` + `role` + `aria-hidden`. An empty string is treated as decorative. Do not set it when an interactive parent (Button, link) already names the control.',
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
    icon: option('RiErrorWarningLine'),
    label: 'Error',
  },
});

export const InheritsTextStyle = meta.story({
  args: {
    icon: option('RiMailLine'),
  },
  render: (args) => (
    <p className="type-label-md flex items-center gap-2 text-red-600 dark:text-red-400">
      <Icon {...args} />
      Couldn't send the email
    </p>
  ),
});
