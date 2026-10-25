import preview from '../../../.storybook/preview.tsx';
import { Table } from '../table/table.ts';
import { Badge } from './badge.tsx';

const meta = preview.meta({
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Draft' },
  parameters: { layout: 'centered' },
});

export const Neutral = meta.story({});

export const Info = meta.story({
  args: { variant: 'info', children: 'Shipped' },
});

export const Success = meta.story({
  args: { variant: 'success', children: 'Paid' },
});

export const Warning = meta.story({
  args: { variant: 'warning', children: 'Awaiting payment' },
});

export const Danger = meta.story({
  args: { variant: 'danger', children: 'Refunded' },
});

const orders = [
  {
    number: '#1042',
    customer: 'Ada Lovelace',
    status: 'Paid',
    variant: 'success',
  },
  {
    number: '#1043',
    customer: 'Grace Hopper',
    status: 'Awaiting payment',
    variant: 'warning',
  },
  {
    number: '#1044',
    customer: 'Alan Turing',
    status: 'Shipped',
    variant: 'info',
  },
  {
    number: '#1045',
    customer: 'Katherine Johnson',
    status: 'Refunded',
    variant: 'danger',
  },
  {
    number: '#1046',
    customer: 'Edsger Dijkstra',
    status: 'Draft',
    variant: 'neutral',
  },
] as const;

/** Badges show one status per row in a table. */
export const InTable = meta.story({
  parameters: { layout: 'padded' },
  render: () => (
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
          <Table.Column>Customer</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.number}>
              <Table.Cell>{order.number}</Table.Cell>
              <Table.Cell>{order.customer}</Table.Cell>
              <Table.Cell>
                <Badge variant={order.variant}>{order.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table.Root>
  ),
});
