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

test('counts columns rendered inside fragments and components', async () => {
  function ExtraColumns() {
    return (
      <>
        <Table.Column>Status</Table.Column>
        <Table.Column>Total</Table.Column>
      </>
    );
  }
  function Orders({ showTotal }: { showTotal: boolean }) {
    return (
      <Table.Root aria-label="Orders">
        <Table.Header>
          <>
            <Table.Column>Order</Table.Column>
            <Table.Column>Customer</Table.Column>
          </>
          {showTotal && <ExtraColumns />}
        </Table.Header>
        <Table.Body />
      </Table.Root>
    );
  }

  const screen = await render(<Orders showTotal />);
  const table = screen.getByRole('table', { name: 'Orders' });
  await expect
    .element(table)
    .toHaveAttribute('style', expect.stringContaining('--table-columns: 4;'));

  await screen.rerender(<Orders showTotal={false} />);
  await expect
    .element(table)
    .toHaveAttribute('style', expect.stringContaining('--table-columns: 2;'));
});

test('a row renders as the element passed to render', async () => {
  const screen = await render(
    <Table.Root aria-label="Orders">
      <Table.Header>
        <Table.Column>Order</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row render={<a href="#order-1001" />}>
          <Table.Cell>#1001</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>#1002</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );

  const rows = screen.getByRole('row');
  const link = rows.nth(1).element();
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('#order-1001');
  expect(link.textContent).toBe('#1001');
  expect(rows.nth(2).element().tagName).toBe('TR');

  await rows.nth(1).click();
  expect(window.location.hash).toBe('#order-1001');
});

test('a rendered row merges its props with the row props', async () => {
  const onRowClick = vi.fn();
  const onLinkClick = vi.fn();
  const screen = await render(
    <Table.Root aria-label="Orders">
      <Table.Header>
        <Table.Column>Order</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row
          onClick={onRowClick}
          render={<a href="#order" className="custom" onClick={onLinkClick} />}
        >
          <Table.Cell>#1001</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );

  const row = screen.getByRole('row').nth(1);
  await expect.element(row).toHaveClass('custom');
  await expect.element(row).toHaveClass('grid');

  await row.click();
  expect(onRowClick).toHaveBeenCalledOnce();
  expect(onLinkClick).toHaveBeenCalledOnce();
});
