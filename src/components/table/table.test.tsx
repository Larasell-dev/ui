import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Thumbnail } from '../thumbnail/thumbnail.tsx';
import { Table } from './table.ts';

function Orders({ rows }: { rows: number }) {
  return (
    <div style={{ height: 300 }}>
      <Table.Root aria-label="Orders">
        <Table.Content>
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
        </Table.Content>
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
        <Table.Content>
          <Table.Header>
            <>
              <Table.Column>Order</Table.Column>
              <Table.Column>Customer</Table.Column>
            </>
            {showTotal && <ExtraColumns />}
          </Table.Header>
          <Table.Body />
        </Table.Content>
      </Table.Root>
    );
  }

  const screen = await render(<Orders showTotal />);
  // The column count is set on the frame, which wraps the table.
  const table = screen.getByRole('table', { name: 'Orders' });
  const frame = table.element().parentElement!;
  await expect
    .poll(() => frame.style.getPropertyValue('--table-columns'))
    .toBe('4');

  await screen.rerender(<Orders showTotal={false} />);
  await expect
    .poll(() => frame.style.getPropertyValue('--table-columns'))
    .toBe('2');
});

test('link rows keep table semantics and take one tab stop each', async () => {
  const screen = await render(
    <>
      <Table.Root aria-label="Orders">
        <Table.Content>
          <Table.Header>
            <Table.Column>Order</Table.Column>
            <Table.Column>Customer</Table.Column>
          </Table.Header>
          <Table.Body>
            {['1001', '1002'].map((id) => (
              <Table.Row key={id}>
                <Table.Cell>
                  <Table.Link render={<a href={`#order-${id}`} />}>
                    #{id}
                  </Table.Link>
                </Table.Cell>
                <Table.Cell>Ada Lovelace</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.Root>
      <button>After</button>
    </>,
  );

  const rows = screen.getByRole('row');
  expect(rows.nth(1).element().tagName).toBe('TR');
  const first = rows.nth(1).getByRole('link', { name: '#1001' });
  const second = rows.nth(2).getByRole('link', { name: '#1002' });
  await expect.element(first).toHaveAttribute('href', '#order-1001');

  await userEvent.tab();
  await expect.element(first).toHaveFocus();
  await userEvent.tab();
  await expect.element(second).toHaveFocus();
  await userEvent.tab();
  await expect
    .element(screen.getByRole('button', { name: 'After' }))
    .toHaveFocus();

  await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
  await userEvent.keyboard('{Enter}');
  expect(window.location.hash).toBe('#order-1002');
});

test('a row renders as the element passed to render, merging props', async () => {
  const onRowClick = vi.fn();
  const onElementClick = vi.fn();
  const screen = await render(
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row
            onClick={onRowClick}
            render={<tr data-order="1001" onClick={onElementClick} />}
          >
            <Table.Cell>#1001</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table.Root>,
  );

  const row = screen.getByRole('row').nth(1);
  await expect.element(row).toHaveAttribute('data-order', '1001');
  await expect.element(row).toHaveClass('grid');

  await row.click();
  expect(onRowClick).toHaveBeenCalledOnce();
  expect(onElementClick).toHaveBeenCalledOnce();
});

test('render cannot restyle a row or a link', async () => {
  const screen = await render(
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row
            render={<tr className="mt-4" style={{ marginTop: '16px' }} />}
          >
            <Table.Cell>
              <Table.Link
                render={
                  <a
                    href="#order"
                    className="text-red-500"
                    style={{ color: 'rgb(255, 0, 0)' }}
                  />
                }
              >
                #1001
              </Table.Link>
            </Table.Cell>
          </Table.Row>
          <Table.Row render={(props) => <tr {...props} className="mt-4" />}>
            <Table.Cell>#1002</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table.Root>,
  );

  const row = screen.getByRole('row').nth(1);
  await expect.element(row).toHaveClass('grid');
  await expect.element(row).not.toHaveClass('mt-4');
  await expect.element(row).not.toHaveStyle({ marginTop: '16px' });

  const link = screen.getByRole('link', { name: '#1001' });
  await expect.element(link).toHaveAttribute('href', '#order');
  await expect.element(link).not.toHaveClass('text-red-500');
  await expect.element(link).not.toHaveStyle({ color: 'rgb(255, 0, 0)' });

  const renderedRow = screen.getByRole('row').nth(2);
  await expect.element(renderedRow).toHaveClass('grid');
  await expect.element(renderedRow).not.toHaveClass('mt-4');
});

test('Table.Root applies DANGEROUS_className and DANGEROUS_style', async () => {
  const screen = await render(
    <Table.Root
      aria-label="Orders"
      DANGEROUS_className="mt-4"
      DANGEROUS_style={{ marginTop: '16px' }}
    >
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
        </Table.Header>
        <Table.Body />
      </Table.Content>
    </Table.Root>,
  );

  const frame = screen.getByRole('table').element().parentElement!;
  expect(frame.classList.contains('mt-4')).toBe(true);
  expect(frame.style.marginTop).toBe('16px');
});

test('the pagination renders outside the table, wherever it is nested', async () => {
  function Footer() {
    return (
      <>
        <Table.Pagination
          page={1}
          pageSize={25}
          total={240}
          onPaginationChange={vi.fn()}
        />
      </>
    );
  }

  const screen = await render(
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>#1001</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
      <Footer />
    </Table.Root>,
  );

  const table = screen.getByRole('table', { name: 'Orders' }).element();
  expect(table.tagName).toBe('TABLE');
  expect(table.querySelector('thead')).not.toBeNull();
  expect(table.querySelector('tbody')).not.toBeNull();

  const nav = screen.getByRole('navigation', { name: 'Pagination' }).element();
  expect(table.contains(nav)).toBe(false);
});

test('a cell shows its media before its value, outside the row link', async () => {
  const screen = await render(
    <Table.Root aria-label="Books">
      <Table.Content>
        <Table.Header>
          <Table.Column>Title</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell media={<Thumbnail src="/covers/dune.jpg" />}>
              <Table.Link render={<a href="/books/1" />}>Dune</Table.Link>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table.Root>,
  );

  const cell = screen.getByRole('cell').element();
  const image = cell.querySelector('img')!;
  const link = screen.getByRole('link', { name: 'Dune' }).element();
  expect(
    image.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(link.contains(image)).toBe(false);
});
