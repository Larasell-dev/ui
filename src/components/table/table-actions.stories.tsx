import DeleteBinLine from '@iconify-icons/ri/delete-bin-line';
import FileCopyLine from '@iconify-icons/ri/file-copy-line';
import PencilLine from '@iconify-icons/ri/pencil-line';
import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview.tsx';
import { Table } from './table.ts';

type Order = {
  id: string;
  customer: string;
  status: string;
  total: string;
};

const orders: Order[] = [
  { id: '#1001', customer: 'Ada Lovelace', status: 'Paid', total: '€9.95' },
  { id: '#1002', customer: 'Grace Hopper', status: 'Pending', total: '€46.95' },
  { id: '#1003', customer: 'Alan Turing', status: 'Refunded', total: '€83.95' },
  {
    id: '#1004',
    customer: 'Linus Torvalds',
    status: 'Shipped',
    total: '€120.95',
  },
];

const onRowClick = fn();
const onEdit = fn();
const onDuplicate = fn();
const onDelete = fn();

function OrderActions({
  order,
  defaultOpen,
}: {
  order: Order;
  defaultOpen?: boolean;
}) {
  return (
    <Table.Actions defaultOpen={defaultOpen}>
      <Table.ActionsTrigger aria-label={`Actions for ${order.id}`} />
      <Table.ActionsPopup>
        <Table.ActionsItem onClick={() => onEdit(order.id)}>
          Edit
        </Table.ActionsItem>
        <Table.ActionsItem onClick={() => onDuplicate(order.id)}>
          Duplicate
        </Table.ActionsItem>
        <Table.ActionsItem onClick={() => onDelete(order.id)}>
          Delete
        </Table.ActionsItem>
      </Table.ActionsPopup>
    </Table.Actions>
  );
}

const meta = preview.meta({
  title: 'Organisms/Table/Actions',
  component: Table.Actions,
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
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
          <Table.Column>Customer</Table.Column>
          <Table.Column>Status</Table.Column>
          <Table.Column type="action">Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id} onClick={() => onRowClick(order.id)}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.customer}</Table.Cell>
              <Table.Cell>{order.status}</Table.Cell>
              <Table.Cell>
                <OrderActions order={order} defaultOpen={order === orders[0]} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table.Root>
  ),
});

export const LinkItems = meta.story({
  render: () => (
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
          <Table.Column>Customer</Table.Column>
          <Table.Column type="action">Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>
                <Table.Link render={<a href={`#order-${order.id.slice(1)}`} />}>
                  {order.id}
                </Table.Link>
              </Table.Cell>
              <Table.Cell>{order.customer}</Table.Cell>
              <Table.Cell>
                <Table.Actions defaultOpen={order === orders[0]}>
                  <Table.ActionsTrigger
                    aria-label={`Actions for ${order.id}`}
                  />
                  <Table.ActionsPopup>
                    <Table.ActionsItem
                      render={<a href={`#order-${order.id.slice(1)}/edit`} />}
                    >
                      Edit
                    </Table.ActionsItem>
                    <Table.ActionsItem onClick={() => onDelete(order.id)}>
                      Delete
                    </Table.ActionsItem>
                  </Table.ActionsPopup>
                </Table.Actions>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table.Root>
  ),
});

export const IconsAndDestructive = meta.story({
  render: () => (
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
          <Table.Column>Customer</Table.Column>
          <Table.Column>Status</Table.Column>
          <Table.Column type="action">Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.customer}</Table.Cell>
              <Table.Cell>{order.status}</Table.Cell>
              <Table.Cell>
                <Table.Actions defaultOpen={order === orders[0]}>
                  <Table.ActionsTrigger
                    aria-label={`Actions for ${order.id}`}
                  />
                  <Table.ActionsPopup>
                    <Table.ActionsItem
                      icon={PencilLine}
                      onClick={() => onEdit(order.id)}
                    >
                      Edit
                    </Table.ActionsItem>
                    <Table.ActionsItem
                      icon={FileCopyLine}
                      onClick={() => onDuplicate(order.id)}
                    >
                      Duplicate
                    </Table.ActionsItem>
                    <Table.ActionsItem
                      variant="destructive"
                      icon={DeleteBinLine}
                      onClick={() => onDelete(order.id)}
                    >
                      Delete
                    </Table.ActionsItem>
                  </Table.ActionsPopup>
                </Table.Actions>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table.Root>
  ),
});

/**
 * Disabled items are dimmed and do not highlight on hover or keyboard focus,
 * e.g. when an order can no longer be refunded.
 */
export const DisabledItems = meta.story({
  render: () => (
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
          <Table.Column>Status</Table.Column>
          <Table.Column type="action">Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.status}</Table.Cell>
              <Table.Cell>
                <Table.Actions defaultOpen={order.status === 'Refunded'}>
                  <Table.ActionsTrigger
                    aria-label={`Actions for ${order.id}`}
                  />
                  <Table.ActionsPopup>
                    <Table.ActionsItem onClick={() => onEdit(order.id)}>
                      Edit
                    </Table.ActionsItem>
                    <Table.ActionsItem
                      disabled={order.status === 'Refunded'}
                      onClick={() => onDuplicate(order.id)}
                    >
                      Refund
                    </Table.ActionsItem>
                    <Table.ActionsItem
                      variant="destructive"
                      disabled={order.status !== 'Pending'}
                      onClick={() => onDelete(order.id)}
                    >
                      Delete
                    </Table.ActionsItem>
                  </Table.ActionsPopup>
                </Table.Actions>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table.Root>
  ),
});
