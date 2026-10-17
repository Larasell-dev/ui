import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Pagination } from './pagination.tsx';

test('moves between pages', async () => {
  const onPaginationChange = vi.fn();
  const screen = await render(
    <Pagination
      page={2}
      pageSize={25}
      total={240}
      onPaginationChange={onPaginationChange}
    />,
  );

  await screen.getByRole('button', { name: 'Next page' }).click();
  expect(onPaginationChange).toHaveBeenLastCalledWith({
    page: 3,
    pageSize: 25,
  });

  await screen.getByRole('button', { name: 'Previous page' }).click();
  expect(onPaginationChange).toHaveBeenLastCalledWith({
    page: 1,
    pageSize: 25,
  });

  // 240 rows / 25 per page = 10 pages, the last one partial.
  await screen.getByRole('button', { name: 'Last page' }).click();
  expect(onPaginationChange).toHaveBeenLastCalledWith({
    page: 10,
    pageSize: 25,
  });

  await screen.getByRole('button', { name: 'First page' }).click();
  expect(onPaginationChange).toHaveBeenLastCalledWith({
    page: 1,
    pageSize: 25,
  });
});

test('disables the buttons that would leave the page range', async () => {
  const props = { pageSize: 25, total: 240, onPaginationChange: vi.fn() };
  const screen = await render(<Pagination page={1} {...props} />);

  await expect
    .element(screen.getByRole('button', { name: 'First page' }))
    .toHaveAttribute('aria-disabled', 'true');
  await expect
    .element(screen.getByRole('button', { name: 'Previous page' }))
    .toHaveAttribute('aria-disabled', 'true');
  await expect
    .element(screen.getByRole('button', { name: 'Next page' }))
    .not.toHaveAttribute('aria-disabled', 'true');
  await expect.element(screen.getByText('Page 1 of 10')).toBeInTheDocument();

  await screen.rerender(<Pagination page={10} {...props} />);

  await expect
    .element(screen.getByRole('button', { name: 'Previous page' }))
    .not.toHaveAttribute('aria-disabled', 'true');
  await expect
    .element(screen.getByRole('button', { name: 'Next page' }))
    .toHaveAttribute('aria-disabled', 'true');
  await expect
    .element(screen.getByRole('button', { name: 'Last page' }))
    .toHaveAttribute('aria-disabled', 'true');
});

test('changing the page size keeps the first visible row on screen', async () => {
  const onPaginationChange = vi.fn();
  const screen = await render(
    <Pagination
      page={3}
      pageSize={25}
      total={240}
      onPaginationChange={onPaginationChange}
    />,
  );

  await screen.getByRole('combobox', { name: 'Rows per page' }).click();
  await screen.getByRole('option', { name: '10' }).click();

  // Page 3 at 25 rows starts at row 51, which is on page 6 at 10 rows.
  expect(onPaginationChange).toHaveBeenLastCalledWith({
    page: 6,
    pageSize: 10,
  });
});

test('disabled turns off every control', async () => {
  const screen = await render(
    <Pagination
      page={5}
      pageSize={25}
      total={240}
      disabled
      onPaginationChange={vi.fn()}
    />,
  );

  for (const name of [
    'First page',
    'Previous page',
    'Next page',
    'Last page',
  ]) {
    await expect
      .element(screen.getByRole('button', { name }))
      .toHaveAttribute('aria-disabled', 'true');
  }
});

test('a button keeps focus when it becomes disabled', async () => {
  const props = { pageSize: 25, total: 240, onPaginationChange: vi.fn() };
  const screen = await render(<Pagination page={9} {...props} />);
  const next = screen.getByRole('button', { name: 'Next page' });

  await next.click();
  await screen.rerender(<Pagination page={10} {...props} />);

  await expect.element(next).toHaveFocus();
  await expect.element(next).toHaveAttribute('aria-disabled', 'true');
  await userEvent.keyboard('{Enter}');
  expect(props.onPaginationChange).toHaveBeenCalledOnce();
});

test('the page size select keeps focus while disabled but cannot change', async () => {
  const props = {
    page: 1,
    pageSize: 25,
    total: 240,
    onPaginationChange: vi.fn(),
  };
  const screen = await render(<Pagination {...props} />);
  const select = screen.getByRole('combobox', { name: 'Rows per page' });

  await userEvent.tab();
  await expect.element(select).toHaveFocus();

  await screen.rerender(<Pagination {...props} disabled />);
  await new Promise(requestAnimationFrame);
  await expect.element(select).toHaveFocus();

  // Still in the tab order: leave it and come back.
  await userEvent.tab();
  await userEvent.tab({ shift: true });
  await expect.element(select).toHaveFocus();
  await expect.element(select).toHaveAttribute('aria-disabled', 'true');

  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{ArrowDown}');
  await select.click({ force: true });
  await expect.element(screen.getByRole('listbox')).not.toBeInTheDocument();
  expect(props.onPaginationChange).not.toHaveBeenCalled();

  await screen.rerender(<Pagination {...props} />);
  await select.click();
  await expect.element(screen.getByRole('listbox')).toBeVisible();
});

test('applies DANGEROUS_className and DANGEROUS_style', async () => {
  const screen = await render(
    <Pagination
      page={1}
      pageSize={25}
      total={240}
      onPaginationChange={vi.fn()}
      DANGEROUS_className="mt-4"
      DANGEROUS_style={{ marginTop: '16px' }}
    />,
  );

  const nav = screen.getByRole('navigation', { name: 'Pagination' });
  await expect.element(nav).toHaveClass('mt-4');
  await expect.element(nav).toHaveStyle({ marginTop: '16px' });
});
