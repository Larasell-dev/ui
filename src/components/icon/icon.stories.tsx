import preview from '../../../.storybook/preview.tsx';
import { Icon, type IconName } from './icon.tsx';
import { icons } from './icons.ts';

const meta = preview.meta({
  title: 'Atoms/Icon',
  component: Icon,
  // The Docs page is where Storybook shows the prop descriptions below.
  tags: ['autodocs'],
  args: {
    name: 'home-line' as const,
  },
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(icons),
      description:
        'Name of a [Remix Icon](https://remixicon.com) the design system exposes. Add more in `src/components/icon/icons.ts`.',
      table: { type: { summary: 'IconName' } },
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
    name: 'error-warning-line',
    label: 'Error',
  },
});

export const InheritsTextStyle = meta.story({
  args: {
    name: 'mail-line',
  },
  render: (args) => (
    <p className="type-label-md flex items-center gap-2 text-red-600 dark:text-red-400">
      <Icon {...args} />
      Couldn't send the email
    </p>
  ),
});

export const AllIcons = meta.story({
  render: () => (
    <ul className="grid grid-cols-4 gap-6 text-mauve-950 dark:text-mauve-100">
      {(Object.keys(icons) as IconName[]).map((name) => (
        <li key={name} className="flex flex-col items-center gap-2">
          <span className="text-2xl">
            <Icon name={name} />
          </span>
          <span className="type-caption-lg text-mauve-500 dark:text-mauve-400">
            {name}
          </span>
        </li>
      ))}
    </ul>
  ),
});
