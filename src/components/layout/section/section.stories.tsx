import type { ReactNode } from 'react';
import preview from '../../../../.storybook/preview.tsx';
import { Button } from '../../form/button/button.tsx';
import { Inset } from '../inset/inset.tsx';
import { SectionStack } from './section-stack.tsx';
import { Section } from './section.ts';

const meta = preview.meta({
  title: 'Molecules/Section',
  component: Section.Root,
  decorators: [
    (Story) => (
      <div className="bg-base-section p-8">
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story({
  args: {
    children: (
      <>
        <Section.Header
          title="General"
          description="How the category appears in the shop."
        />
        <Section.Card>
          <Inset>
            <p className="type-body-md">Content padded by the card's inset.</p>
          </Inset>
        </Section.Card>
      </>
    ),
  },
});

export const WithAction = meta.story({
  args: {
    children: (
      <>
        <Section.Header title="Products">
          <Button>Add product</Button>
        </Section.Header>
        <Section.Card>
          <Inset side="x">
            <p className="type-body-md">Inset on the x axis only.</p>
          </Inset>
        </Section.Card>
      </>
    ),
  },
});

export const Stacked = meta.story({
  render: () => (
    <SectionStack>
      <Section.Root>
        <Section.Header title="General" />
        <Section.Card>
          <Inset>First section</Inset>
        </Section.Card>
      </Section.Root>
      <Section.Root>
        <Section.Header title="SEO" description="Search engine listing." />
        <Section.Card>
          <Inset>Second section</Inset>
        </Section.Card>
      </Section.Root>
    </SectionStack>
  ),
});

/** The header at several widths, so the action's wrap below the text is visible side by side. */
function Widths({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      {[960, 560, 320].map((width) => (
        <div key={width} style={{ width }}>
          <p className="type-body-sm text-base-secondary mb-2">{width}px</p>
          <Section.Root>{children}</Section.Root>
        </div>
      ))}
    </div>
  );
}

export const ShortTextWithAction = meta.story({
  render: () => (
    <Widths>
      <Section.Header title="Products" description="Sold in this category.">
        <Button>Add product</Button>
      </Section.Header>
    </Widths>
  ),
});

export const LongText = meta.story({
  render: () => (
    <Widths>
      <Section.Header
        title="Products shown in this category on the storefront"
        description="Choose which products appear in this category, in which order they are listed, and whether they are also shown in the category's subcategories."
      >
        <Button>Add product</Button>
      </Section.Header>
    </Widths>
  ),
});

/** Like the en-XA pseudo locale: long words that can't break at spaces must still not run under the action. */
export const LongUnbreakableWords = meta.story({
  render: () => (
    <Widths>
      <Section.Header
        title="[Ƥŕöðûçţšƥŕöðûçţšƥŕöðûçţšƥŕöðûçţš]"
        description="[Çĥööšéŵĥîçĥƥŕöðûçţšåƥƥéåŕîñţĥîšçåţéĝöŕýåñðîñŵĥîçĥöŕðéŕţĥéýåŕéļîšţéð one two three]"
      >
        <Button>[Åðð ƥŕöðûçţ one two]</Button>
      </Section.Header>
    </Widths>
  ),
});
