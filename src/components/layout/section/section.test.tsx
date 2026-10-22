import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Section } from './section.ts';

test('is a region named by its header title', async () => {
  const screen = await render(
    <>
      <Section.Root>
        <Section.Header title="General" description="Name and slug" />
        <Section.Card>Fields</Section.Card>
      </Section.Root>
      <Section.Root>
        <Section.Header title="Products" />
      </Section.Root>
    </>,
  );

  const general = screen.getByRole('region', { name: 'General' });
  await expect.element(general).toBeInTheDocument();
  await expect.element(general.getByText('Fields')).toBeInTheDocument();
  await expect
    .element(screen.getByRole('region', { name: 'Products' }))
    .toBeInTheDocument();
});

test('shows the action next to the title', async () => {
  const screen = await render(
    <Section.Root>
      <Section.Header title="Products" action={<button>Add</button>} />
    </Section.Root>,
  );

  await expect
    .element(
      screen
        .getByRole('region', { name: 'Products' })
        .getByRole('button', { name: 'Add' }),
    )
    .toBeInTheDocument();
});
