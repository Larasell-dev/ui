import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview.tsx';
import type { PaginationChange } from '../pagination/pagination.tsx';
import { Table } from './table.ts';

type Order = {
  id: string;
  customer: string;
  status: string;
  total: string;
};

const statuses = ['Paid', 'Pending', 'Refunded', 'Shipped'];
const customers = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Linus Torvalds',
  'Margaret Hamilton',
];

const allOrders: Order[] = Array.from({ length: 243 }, (_, index) => ({
  id: `#${String(1001 + index)}`,
  customer: customers[index % customers.length]!,
  status: statuses[index % statuses.length]!,
  total: `€${(((index * 37) % 500) + 9.95).toFixed(2)}`,
}));

// Stands in for a server endpoint that returns one page at a time.
function fetchOrders({ page, pageSize }: PaginationChange) {
  return new Promise<Order[]>((resolve) =>
    setTimeout(
      () => resolve(allOrders.slice((page - 1) * pageSize, page * pageSize)),
      300,
    ),
  );
}

function OrderRows({ orders }: { orders: Order[] }) {
  return orders.map((order) => (
    <Table.Row key={order.id}>
      <Table.Cell>{order.id}</Table.Cell>
      <Table.Cell>{order.customer}</Table.Cell>
      <Table.Cell>{order.status}</Table.Cell>
      <Table.Cell>{order.total}</Table.Cell>
    </Table.Row>
  ));
}

function OrderHeader() {
  return (
    <Table.Header>
      <Table.Column>Order</Table.Column>
      <Table.Column>Customer</Table.Column>
      <Table.Column>Status</Table.Column>
      <Table.Column>Total</Table.Column>
    </Table.Header>
  );
}

const onRowClick = fn();

const meta = preview.meta({
  title: 'Organisms/Table',
  component: Table.Root,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ height: 420 }}>
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story({
  render: () => (
    <Table.Root aria-label="Orders">
      <OrderHeader />
      <Table.Body>
        <OrderRows orders={allOrders.slice(0, 5)} />
      </Table.Body>
    </Table.Root>
  ),
});

export const ScrollingBody = meta.story({
  render: () => (
    <Table.Root aria-label="Orders">
      <OrderHeader />
      <Table.Body>
        <OrderRows orders={allOrders.slice(0, 40)} />
      </Table.Body>
    </Table.Root>
  ),
});

export const ClickableRows = meta.story({
  render: () => (
    <Table.Root aria-label="Orders">
      <OrderHeader />
      <Table.Body>
        {allOrders.slice(0, 20).map((order) => (
          <Table.Row key={order.id} onClick={() => onRowClick(order.id)}>
            <Table.Cell>{order.id}</Table.Cell>
            <Table.Cell>{order.customer}</Table.Cell>
            <Table.Cell>{order.status}</Table.Cell>
            <Table.Cell>{order.total}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
});

export const LinkRows = meta.story({
  render: () => (
    <Table.Root aria-label="Orders">
      <OrderHeader />
      <Table.Body>
        {allOrders.slice(0, 20).map((order) => (
          <Table.Row
            key={order.id}
            render={<a href={`#order-${order.id.slice(1)}`} />}
          >
            <Table.Cell>{order.id}</Table.Cell>
            <Table.Cell>{order.customer}</Table.Cell>
            <Table.Cell>{order.status}</Table.Cell>
            <Table.Cell>{order.total}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
});

function ServerPaginatedOrders() {
  const [pagination, setPagination] = useState<PaginationChange>({
    page: 1,
    pageSize: 25,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = true;
    setLoading(true);
    void fetchOrders(pagination).then((result) => {
      if (!current) return;
      setOrders(result);
      setLoading(false);
    });
    return () => {
      current = false;
    };
  }, [pagination]);

  return (
    <Table.Root aria-label="Orders">
      <OrderHeader />
      <Table.Body>
        <OrderRows orders={orders} />
      </Table.Body>
      <Table.Pagination
        {...pagination}
        total={allOrders.length}
        disabled={loading}
        onPaginationChange={setPagination}
      />
    </Table.Root>
  );
}

export const WithPagination = meta.story({
  render: () => <ServerPaginatedOrders />,
});
