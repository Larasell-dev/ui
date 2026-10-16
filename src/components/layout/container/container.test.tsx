import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Container } from './container.tsx';

test('renders its children', async () => {
  const screen = await render(<Container>Content</Container>);

  await expect.element(screen.getByText('Content')).toBeInTheDocument();
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <Container data-testid="container" className="mt-4">
      Content
    </Container>,
  );

  await expect.element(screen.getByTestId('container')).not.toHaveClass('mt-4');
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await render(
    <Container data-testid="container" DANGEROUS_className="mt-4">
      Content
    </Container>,
  );

  const container = screen.getByTestId('container');

  await expect.element(container).toHaveClass('mt-4');
  await expect.element(container).toHaveClass('px-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <Container data-testid="container" style={{ marginTop: 16 }}>
      Content
    </Container>,
  );

  await expect
    .element(screen.getByTestId('container'))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await render(
    <Container data-testid="container" DANGEROUS_style={{ marginTop: '16px' }}>
      Content
    </Container>,
  );

  await expect
    .element(screen.getByTestId('container'))
    .toHaveStyle({ marginTop: '16px' });
});
