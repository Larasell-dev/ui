import { expect, test, vi } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Table } from './table.ts';

function Orders({ rows }: { rows: number }) {
  return (
    <div style={{ height: 300 }}>
      <Table.Root aria-label="Orders">
        <Table.Header>
          <Table.Column>Order</Table.Column>
          <Table.Column>Customer</Table.Column>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: rows }, (_, index) => (
            <Table.Row key={index}>
              <Table.Cell>#{index + 1}</Table.Cell>
              <Table.Cell>Customer {index + 1}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Pagination
          page={1}
          pageSize={25}
          total={rows}
          onPaginationChange={vi.fn()}
        />
      </Table.Root>
    </div>
  );
}

test('exposes table semantics', async () => {
  const screen = await render(<Orders rows={3} />);

  const table = screen.getByRole('table', { name: 'Orders' });
  await expect.element(table).toBeInTheDocument();
  expect(table.getByRole('columnheader').elements()).toHaveLength(2);
  expect(table.getByRole('row').elements()).toHaveLength(4);
  await expect
    .element(screen.getByRole('navigation', { name: 'Pagination' }))
    .toBeInTheDocument();
});

test('a part outside Table.Root throws', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  await expect(render(<Table.Body />)).rejects.toThrow(
    '<Table.Body> must be inside <Table.Root>.',
  );
});
