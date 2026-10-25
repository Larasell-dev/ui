import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { DataList } from './data-list.ts';

// What a caller without TypeScript could pass: plain `className` and `style`.
const untypedStyling = {
  className: 'mt-4',
  style: { marginTop: '16px' },
} as object;

test('exposes a labelled list of items with label/value pairs', async () => {
  const screen = await render(
    <DataList.Root aria-label="Orders">
      <DataList.Item>
        <DataList.Title aside="€9.95">#1001</DataList.Title>
        <DataList.Field label="Customer">Ada Lovelace</DataList.Field>
        <DataList.Field label="Status">Paid</DataList.Field>
      </DataList.Item>
      <DataList.Item>
        <DataList.Title>#1002</DataList.Title>
      </DataList.Item>
    </DataList.Root>,
  );

  const list = screen.getByRole('list', { name: 'Orders' });
  await expect.element(list).toBeInTheDocument();
  expect(list.getByRole('listitem').elements()).toHaveLength(2);

  const first = list.getByRole('listitem').first();
  await expect.element(first.getByText('€9.95')).toBeInTheDocument();
  const terms = first.getByRole('term').elements();
  const definitions = first.getByRole('definition').elements();
  expect(terms.map((term) => term.textContent)).toEqual(['Customer', 'Status']);
  expect(definitions.map((value) => value.textContent)).toEqual([
    'Ada Lovelace',
    'Paid',
  ]);
});

test('aria-labelledby names the list', async () => {
  const screen = await render(
    <>
      <h2 id="orders-heading">Recent orders</h2>
      <DataList.Root aria-labelledby="orders-heading" />
    </>,
  );

  await expect
    .element(screen.getByRole('list', { name: 'Recent orders' }))
    .toBeInTheDocument();
});

test('the title omits the aside when none is given', async () => {
  const screen = await render(
    <DataList.Root aria-label="Orders">
      <DataList.Item>
        <DataList.Title>#1001</DataList.Title>
      </DataList.Item>
    </DataList.Root>,
  );

  const title = screen.getByText('#1001').element().parentElement!;
  expect(title.children).toHaveLength(1);
});

test("a link follows on click and is the item's only tab stop", async () => {
  const onLinkClick = vi.fn((event: { preventDefault: () => void }) =>
    event.preventDefault(),
  );
  const screen = await render(
    <DataList.Root aria-label="Orders">
      <DataList.Item>
        <DataList.Title aside="€9.95">
          <DataList.Link
            render={<a href="#order-1001" onClick={onLinkClick} />}
          >
            #1001
          </DataList.Link>
        </DataList.Title>
        <DataList.Field label="Customer">Ada Lovelace</DataList.Field>
      </DataList.Item>
    </DataList.Root>,
  );

  const link = screen.getByRole('link', { name: '#1001' });
  await expect.element(link).toHaveAttribute('href', '#order-1001');

  await userEvent.tab();
  await expect.element(link).toHaveFocus();
  await userEvent.tab();
  await expect.element(link).not.toHaveFocus();

  await link.click();
  expect(onLinkClick).toHaveBeenCalledTimes(1);
});

test('onClick fires for a click anywhere in the item', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <DataList.Root aria-label="Orders">
      <DataList.Item onClick={onClick}>
        <DataList.Title>#1001</DataList.Title>
        <DataList.Field label="Customer">Ada Lovelace</DataList.Field>
      </DataList.Item>
      <DataList.Item>
        <DataList.Title>#1002</DataList.Title>
      </DataList.Item>
    </DataList.Root>,
  );

  await screen.getByText('Ada Lovelace').click();
  expect(onClick).toHaveBeenCalledTimes(1);
  await expect
    .element(screen.getByRole('listitem').first())
    .toHaveClass('cursor-pointer');
  await expect
    .element(screen.getByRole('listitem').nth(1))
    .not.toHaveClass('cursor-pointer');
});

test('render swaps the item element and merges handlers', async () => {
  const own = vi.fn();
  const rendered = vi.fn();
  const screen = await render(
    <DataList.Root aria-label="Orders">
      <DataList.Item
        onClick={own}
        render={<li data-testid="custom" onClick={rendered} />}
      >
        <DataList.Title>#1001</DataList.Title>
      </DataList.Item>
    </DataList.Root>,
  );

  const item = screen.getByTestId('custom');
  await expect.element(item).toHaveClass('relative');
  await item.click();
  expect(own).toHaveBeenCalledTimes(1);
  expect(rendered).toHaveBeenCalledTimes(1);
});

test('DataList.Root applies DANGEROUS_className and DANGEROUS_style', async () => {
  const screen = await render(
    <DataList.Root
      aria-label="Orders"
      DANGEROUS_className="mt-4"
      DANGEROUS_style={{ marginTop: '16px' }}
    />,
  );

  const list = screen.getByRole('list');
  await expect.element(list).toHaveClass('mt-4');
  // Its own classes are kept alongside.
  await expect.element(list).toHaveClass('flex');
  await expect.element(list).toHaveStyle({ marginTop: '16px' });
});

test('plain className and style are ignored on every part', async () => {
  const screen = await render(
    <DataList.Root aria-label="Orders" {...untypedStyling}>
      <DataList.Item {...untypedStyling}>
        <DataList.Title {...untypedStyling}>
          <DataList.Link render={<a href="#order" />} {...untypedStyling}>
            #1001
          </DataList.Link>
        </DataList.Title>
        <DataList.Field label="Customer" {...untypedStyling}>
          Ada Lovelace
        </DataList.Field>
      </DataList.Item>
    </DataList.Root>,
  );

  const elements = [
    screen.getByRole('list').element(),
    screen.getByRole('listitem').element(),
    screen.getByRole('link').element(),
    screen.getByText('#1001').element().closest('div')!,
    screen.getByRole('term').element().parentElement!,
  ];
  for (const element of elements) {
    expect(element.classList.contains('mt-4')).toBe(false);
    expect((element as HTMLElement).style.marginTop).toBe('');
  }
});

test('render cannot restyle an item or a link', async () => {
  const screen = await render(
    <DataList.Root aria-label="Orders">
      <DataList.Item
        render={<li className="mt-4" style={{ marginTop: '16px' }} />}
      >
        <DataList.Title>
          <DataList.Link
            render={
              <a
                href="#order"
                className="text-red-500"
                style={{ color: 'rgb(255, 0, 0)' }}
              />
            }
          >
            #1001
          </DataList.Link>
        </DataList.Title>
      </DataList.Item>
      <DataList.Item render={(props) => <li {...props} className="mt-4" />}>
        <DataList.Title>#1002</DataList.Title>
      </DataList.Item>
    </DataList.Root>,
  );

  const item = screen.getByRole('listitem').first();
  await expect.element(item).toHaveClass('relative');
  await expect.element(item).not.toHaveClass('mt-4');
  await expect.element(item).not.toHaveStyle({ marginTop: '16px' });

  const link = screen.getByRole('link', { name: '#1001' });
  await expect.element(link).toHaveAttribute('href', '#order');
  await expect.element(link).not.toHaveClass('text-red-500');
  await expect.element(link).not.toHaveStyle({ color: 'rgb(255, 0, 0)' });

  const renderedItem = screen.getByRole('listitem').nth(1);
  await expect.element(renderedItem).toHaveClass('relative');
  await expect.element(renderedItem).not.toHaveClass('mt-4');
});
