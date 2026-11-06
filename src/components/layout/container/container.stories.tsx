import preview from '../../../../.storybook/preview.tsx';
import { Container } from './container.tsx';

const meta = preview.meta({
  title: 'Atoms/Layout/Container',
  component: Container,
  args: {
    children: <Content />,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    children: { control: false },
    DANGEROUS_className: { control: false },
    DANGEROUS_style: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-base-muted py-8">
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story({});

export const Small = meta.story({
  args: { size: 'sm' },
});

export const Medium = meta.story({
  args: { size: 'md' },
});

export const Full = meta.story({
  args: { size: 'full' },
});

export const ShortContent = meta.story({
  args: {
    children: <Box>Short content stays left-aligned</Box>,
  },
});

export const Nested = meta.story({
  args: {
    size: 'lg',
    children: (
      <Container size="sm" DANGEROUS_className="bg-base-muted">
        <Content />
      </Container>
    ),
  },
});

export const WithDangerousOverrides = meta.story({
  args: {
    DANGEROUS_className: 'border-2 border-dashed border-base-medium',
    DANGEROUS_style: { paddingBlock: '24px' },
  },
});

function Content() {
  return (
    <div className="bg-base-surface text-base-primary p-4">
      <h2 className="type-label-md">Container content</h2>
      <p className="text-sm">
        The container centers itself and caps its width, but its children keep
        their normal alignment. Resize the viewport to see the horizontal
        padding grow at the sm and lg breakpoints.
      </p>
    </div>
  );
}

function Box({ children }: { children: string }) {
  return (
    <div className="bg-base-muted text-base-primary w-fit px-4 py-2 text-sm">
      {children}
    </div>
  );
}
