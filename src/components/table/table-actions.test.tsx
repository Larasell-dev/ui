import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Table } from './table.ts';

function Orders({
  onRowClick,
  onEdit = vi.fn(),
  onDelete = vi.fn(),
}: {
  onRowClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
          <Table.Column type="action">Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row onClick={onRowClick}>
            <Table.Cell>#1001</Table.Cell>
            <Table.Cell>
              <Table.Actions>
                <Table.ActionsTrigger aria-label="Actions for #1001" />
                <Table.ActionsPopup>
                  <Table.ActionsItem onClick={onEdit}>Edit</Table.ActionsItem>
                  <Table.ActionsItem onClick={onDelete}>
                    Delete
                  </Table.ActionsItem>
                </Table.ActionsPopup>
              </Table.Actions>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table.Root>
  );
}

test('opens a menu of actions and runs the chosen one', async () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const screen = await render(<Orders onEdit={onEdit} onDelete={onDelete} />);

  const trigger = screen.getByRole('button', { name: 'Actions for #1001' });
  await expect.element(trigger).toHaveAttribute('aria-haspopup', 'menu');
  await trigger.click();

  const menu = screen.getByRole('menu');
  await expect.element(menu).toBeVisible();
  expect(menu.getByRole('menuitem').elements()).toHaveLength(2);

  await menu.getByRole('menuitem', { name: 'Delete' }).click();

  expect(onDelete).toHaveBeenCalledOnce();
  expect(onEdit).not.toHaveBeenCalled();
  await expect.element(screen.getByRole('menu')).not.toBeInTheDocument();
});

test('can be used from the keyboard', async () => {
  const onEdit = vi.fn();
  const screen = await render(<Orders onEdit={onEdit} />);

  await userEvent.tab();
  await expect
    .element(screen.getByRole('button', { name: 'Actions for #1001' }))
    .toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect.element(screen.getByRole('menu')).toBeVisible();
  // Opening from the keyboard moves focus to the first item.
  await expect
    .element(screen.getByRole('menuitem', { name: 'Edit' }))
    .toHaveFocus();
  await userEvent.keyboard('{Enter}');

  expect(onEdit).toHaveBeenCalledOnce();
});

test('opening the menu or choosing an action does not click the row', async () => {
  const onRowClick = vi.fn();
  const onEdit = vi.fn();
  const screen = await render(
    <Orders onRowClick={onRowClick} onEdit={onEdit} />,
  );

  await screen.getByRole('button', { name: 'Actions for #1001' }).click();
  await screen.getByRole('menuitem', { name: 'Edit' }).click();

  expect(onEdit).toHaveBeenCalledOnce();
  expect(onRowClick).not.toHaveBeenCalled();
});

test('the trigger stays clickable on a link row', async () => {
  const onEdit = vi.fn();
  const screen = await render(
    <Table.Root aria-label="Orders">
      <Table.Content>
        <Table.Header>
          <Table.Column>Order</Table.Column>
          <Table.Column type="action">Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Table.Link render={<a href="#order-1001" />}>#1001</Table.Link>
            </Table.Cell>
            <Table.Cell>
              <Table.Actions>
                <Table.ActionsTrigger aria-label="Actions for #1001" />
                <Table.ActionsPopup>
                  <Table.ActionsItem onClick={onEdit}>Edit</Table.ActionsItem>
                </Table.ActionsPopup>
              </Table.Actions>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table.Root>,
  );

  // A real click lands on whatever is on top, so the stretched link must not
  // cover the trigger.
  await screen.getByRole('button', { name: 'Actions for #1001' }).click();
  await screen.getByRole('menuitem', { name: 'Edit' }).click();

  expect(onEdit).toHaveBeenCalledOnce();
  expect(location.hash).not.toBe('#order-1001');
});

test('the trigger accepts DANGEROUS_className and DANGEROUS_style', async () => {
  const screen = await render(
    <Table.Actions>
      <Table.ActionsTrigger
        aria-label="Actions"
        DANGEROUS_className="mt-4"
        DANGEROUS_style={{ marginLeft: '16px' }}
      />
    </Table.Actions>,
  );

  const trigger = screen.getByRole('button', { name: 'Actions' });
  await expect.element(trigger).toHaveClass('mt-4');
  await expect.element(trigger).toHaveStyle({ marginLeft: '16px' });
});

test('the trigger does not accept className', async () => {
  const screen = await render(
    <Table.Actions>
      {/* @ts-expect-error className is blocked; use DANGEROUS_className */}
      <Table.ActionsTrigger aria-label="Actions" className="mt-4" />
    </Table.Actions>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Actions' }))
    .not.toHaveClass('mt-4');
});

test('the trigger does not accept style', async () => {
  const screen = await render(
    <Table.Actions>
      <Table.ActionsTrigger
        aria-label="Actions"
        // @ts-expect-error style is blocked; use DANGEROUS_style
        style={{ marginLeft: '16px' }}
      />
    </Table.Actions>,
  );

  await expect
    .element(screen.getByRole('button', { name: 'Actions' }))
    .not.toHaveStyle({ marginLeft: '16px' });
});

test('the popup and items cannot be restyled', async () => {
  const screen = await render(
    <Table.Actions defaultOpen>
      <Table.ActionsTrigger aria-label="Actions" />
      {/* @ts-expect-error only the trigger can be restyled */}
      <Table.ActionsPopup DANGEROUS_className="mt-4">
        {/* @ts-expect-error only the trigger can be restyled */}
        <Table.ActionsItem DANGEROUS_className="mt-4">Edit</Table.ActionsItem>
        {/* @ts-expect-error className is blocked */}
        <Table.ActionsItem className="mt-4">Delete</Table.ActionsItem>
      </Table.ActionsPopup>
    </Table.Actions>,
  );

  await expect.element(screen.getByRole('menu')).not.toHaveClass('mt-4');
  for (const name of ['Edit', 'Delete']) {
    await expect
      .element(screen.getByRole('menuitem', { name }))
      .not.toHaveClass('mt-4');
  }
});

test('the actions column is named for screen readers', async () => {
  const screen = await render(<Orders />);

  await expect
    .element(screen.getByRole('columnheader', { name: 'Actions' }))
    .toBeInTheDocument();
});

test('the actions column gets its own track instead of an equal share', async () => {
  const screen = await render(<Orders />);

  // The grid is sized on the frame, which wraps the table.
  const frame = screen
    .getByRole('table', { name: 'Orders' })
    .element().parentElement!;
  await expect
    .poll(() => frame.style.getPropertyValue('--table-columns'))
    .toBe('1');
  expect(frame.style.getPropertyValue('--table-actions')).not.toBe('');
});
