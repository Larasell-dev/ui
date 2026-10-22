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
      <div className="bg-mauve-50 p-8 dark:bg-mauve-900">
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
        <Section.Header
          title="Products"
          action={<Button>Add product</Button>}
        />
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
