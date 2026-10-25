import preview from '../../../.storybook/preview.tsx';
import { BuildingLine } from '../../icons.ts';
import { swatch } from './swatch.ts';
import { Thumbnail } from './thumbnail.tsx';

const meta = preview.meta({
  title: 'Atoms/Thumbnail',
  component: Thumbnail,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
});

export const Picture = meta.story({
  args: { src: swatch('#a855f7'), title: 'Ada Lovelace' },
});

export const RoundPicture = meta.story({
  args: { src: swatch('#0ea5e9'), shape: 'round', alt: 'Grace Hopper' },
});

export const Icon = meta.story({
  args: { icon: BuildingLine, title: 'Company' },
});
