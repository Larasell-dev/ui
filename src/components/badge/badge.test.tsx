import { expect, test } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Badge } from './badge.tsx';

test('shows its text, in a cell of the table it labels', async () => {
  const screen = await render(
    <table>
      <tbody>
        <tr>
          <td>
            <Badge variant="success">Approved</Badge>
          </td>
        </tr>
      </tbody>
    </table>,
  );

  await expect
    .element(screen.getByRole('cell', { name: 'Approved' }))
    .toBeVisible();
});

test('is not a live region, so a table of badges is not announced', async () => {
  const screen = await render(<Badge variant="warning">Pending</Badge>);

  await expect.element(screen.getByText('Pending')).toBeVisible();
  for (const role of ['status', 'alert', 'log'] as const) {
    expect(
      screen.getByRole(role, { includeHidden: true }).elements(),
    ).toHaveLength(0);
  }
  await expect
    .element(screen.getByText('Pending'))
    .not.toHaveAttribute('aria-live');
});

test('is not a tab stop', async () => {
  const screen = await render(
    <>
      <button>Before</button>
      <Badge variant="danger">Rejected</Badge>
      <button>After</button>
    </>,
  );

  await screen.getByRole('button', { name: 'Before' }).click();
  await userEvent.tab();

  await expect
    .element(screen.getByRole('button', { name: 'After' }))
    .toHaveFocus();
});

test('takes only the known variants', () => {
  void (<Badge>Draft</Badge>);
  void (<Badge variant="info">Shipped</Badge>);
  // @ts-expect-error Only neutral, info, success, warning and danger are variants.
  void (<Badge variant="approved">Approved</Badge>);
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <Badge className="mt-4">Approved</Badge>,
  );

  await expect.element(screen.getByText('Approved')).not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <Badge style={{ marginLeft: 8 }}>Approved</Badge>,
  );

  await expect
    .element(screen.getByText('Approved'))
    .not.toHaveStyle({ marginLeft: '8px' });
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await render(
    <Badge DANGEROUS_className="mt-4">Approved</Badge>,
  );

  await expect.element(screen.getByText('Approved')).toHaveClass('mt-4');
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await render(
    <Badge DANGEROUS_style={{ marginLeft: 8 }}>Approved</Badge>,
  );

  await expect
    .element(screen.getByText('Approved'))
    .toHaveStyle({ marginLeft: '8px' });
});
