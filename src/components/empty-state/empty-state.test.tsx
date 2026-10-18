import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { InboxLine } from '../../icons.ts';
import { Button } from '../form/button/button.tsx';
import { EmptyState } from './empty-state.tsx';

test('renders the title as a heading with the description', async () => {
  const screen = await render(
    <EmptyState
      title="No customers yet"
      description="Customers appear here after their first order."
    />,
  );

  await expect
    .element(screen.getByRole('heading', { name: 'No customers yet' }))
    .toBeVisible();
  await expect
    .element(screen.getByText('Customers appear here after their first order.'))
    .toBeVisible();
});

test('renders the icon hidden from assistive tech', async () => {
  const screen = await render(
    <EmptyState icon={InboxLine} title="No messages" />,
  );

  await expect
    .element(screen.getByRole('img', { includeHidden: true }))
    .toHaveAttribute('aria-hidden', 'true');
});

test('renders no icon when none is given', async () => {
  const screen = await render(<EmptyState title="No messages" />);

  await expect
    .element(screen.getByRole('img', { includeHidden: true }))
    .not.toBeInTheDocument();
});

test('renders children as actions', async () => {
  const screen = await render(
    <EmptyState title="No products yet">
      <Button>Add product</Button>
    </EmptyState>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Add product' }))
    .toBeVisible();
});

test('does not accept className or style', async () => {
  const props = { className: 'mt-4', style: { marginTop: 16 } };
  const screen = await render(
    // Spread untyped, as a JavaScript caller would pass them.
    <EmptyState title="No messages" {...(props as object)} />,
  );

  const root = screen.container.firstElementChild as HTMLElement;

  await expect.element(root).not.toHaveClass('mt-4');
  await expect.element(root).not.toHaveStyle({ marginTop: '16px' });
});

test('accepts DANGEROUS_className and DANGEROUS_style', async () => {
  const screen = await render(
    <EmptyState
      title="No messages"
      DANGEROUS_className="mt-4"
      DANGEROUS_style={{ marginLeft: 8 }}
    />,
  );

  const root = screen.container.firstElementChild as HTMLElement;

  await expect.element(root).toHaveClass('mt-4');
  await expect.element(root).toHaveStyle({ marginLeft: '8px' });
});
