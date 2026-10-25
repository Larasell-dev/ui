import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview.tsx';
import { BuildingLine } from '../../icons.ts';
import { swatch } from '../thumbnail/swatch.ts';
import { Thumbnail } from '../thumbnail/thumbnail.tsx';
import { DataList } from './data-list.ts';

type Order = {
  id: string;
  customer: string;
  email: string;
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

const orders: Order[] = Array.from({ length: 20 }, (_, index) => {
  const customer = customers[index % customers.length]!;
  return {
    id: `#${String(1001 + index)}`,
    customer,
    email: `${customer.toLowerCase().replace(' ', '.')}@example.com`,
    status: statuses[index % statuses.length]!,
    total: `€${(((index * 37) % 500) + 9.95).toFixed(2)}`,
  };
});

function OrderFields({ order }: { order: Order }) {
  return (
    <>
      <DataList.Field label="Customer">{order.customer}</DataList.Field>
      <DataList.Field label="Email">{order.email}</DataList.Field>
      <DataList.Field label="Status">{order.status}</DataList.Field>
    </>
  );
}

const onItemClick = fn();

const meta = preview.meta({
  title: 'Organisms/DataList',
  component: DataList.Root,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 375 }}>
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story({
  render: () => (
    <DataList.Root aria-label="Orders">
      {orders.slice(0, 5).map((order) => (
        <DataList.Item key={order.id}>
          <DataList.Title aside={order.total}>{order.id}</DataList.Title>
          <OrderFields order={order} />
        </DataList.Item>
      ))}
    </DataList.Root>
  ),
});

export const LinkItems = meta.story({
  render: () => (
    <DataList.Root aria-label="Orders">
      {orders.map((order) => (
        <DataList.Item key={order.id}>
          <DataList.Title aside={order.total}>
            <DataList.Link render={<a href={`#order-${order.id.slice(1)}`} />}>
              {order.id}
            </DataList.Link>
          </DataList.Title>
          <OrderFields order={order} />
        </DataList.Item>
      ))}
    </DataList.Root>
  ),
});

export const ClickableItems = meta.story({
  render: () => (
    <DataList.Root aria-label="Orders">
      {orders.map((order) => (
        <DataList.Item key={order.id} onClick={() => onItemClick(order.id)}>
          <DataList.Title aside={order.total}>{order.id}</DataList.Title>
          <OrderFields order={order} />
        </DataList.Item>
      ))}
    </DataList.Root>
  ),
});

export const LongTexts = meta.story({
  render: () => (
    <DataList.Root aria-label="Orders">
      <DataList.Item>
        <DataList.Title aside="€1,249,999,999.00 including shipping, taxes and fees">
          Order #1001 for a customer with a very long company name
        </DataList.Title>
        <DataList.Field label="Customer name as registered with the company">
          Margaret Hamilton-Featherstonehaugh of Featherstonehaugh Enterprises
        </DataList.Field>
        <DataList.Field label="Primary email address for invoices">
          margaret.hamilton-featherstonehaugh@example-enterprises.com
        </DataList.Field>
        <DataList.Field label="Shipping address for this order">
          Keizersgracht 123, 1015 CJ Amsterdam, The Netherlands
        </DataList.Field>
      </DataList.Item>
      <DataList.Item>
        <DataList.Title aside="€1,249,999,999,999,999,999,999.00">
          <DataList.Link render={<a href="#order-1002" />}>
            Order #1002 for
            Donaudampfschifffahrtsgesellschaftskapitänsmützenfabrik
          </DataList.Link>
        </DataList.Title>
        <DataList.Field label="Customer name as registered with the company">
          Grace Brewster Murray Hopper of the United States Navy Reserve
        </DataList.Field>
        <DataList.Field label="Primary email address for invoices">
          grace.brewster.murray.hopper@united-states-navy-reserve.example.com
        </DataList.Field>
        <DataList.Field label="Rechnungsempfängerumsatzsteueridentifikationsnummer">
          DE123456789
        </DataList.Field>
      </DataList.Item>
    </DataList.Root>
  ),
});

export const WithMedia = meta.story({
  render: () => (
    <DataList.Root aria-label="Orders">
      {orders.slice(0, 5).map((order, index) => (
        <DataList.Item key={order.id}>
          <DataList.Title
            aside={order.total}
            media={<Thumbnail src={swatch('#a855f7')} title="Order" />}
          >
            <DataList.Link render={<a href={`#order-${order.id.slice(1)}`} />}>
              {order.id}
            </DataList.Link>
          </DataList.Title>
          <DataList.Field
            label="Customer"
            media={
              index % 3 === 2 ? (
                <Thumbnail icon={BuildingLine} title="Company" />
              ) : (
                <Thumbnail src={swatch('#0ea5e9')} shape="round" />
              )
            }
          >
            {order.customer}
          </DataList.Field>
          <DataList.Field label="Status">{order.status}</DataList.Field>
        </DataList.Item>
      ))}
    </DataList.Root>
  ),
});
