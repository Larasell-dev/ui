import { expect, test } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Icon } from '../icon/icon.tsx';
import { IconButton } from '../form/icon-button/icon-button.tsx';
import { Tooltip } from './tooltip.ts';

test('shows on hover and hides when the pointer leaves', async () => {
  const screen = await render(
    <Tooltip.Provider delay={0} closeDelay={0}>
      <Tooltip.Root>
        <Tooltip.Trigger>Refund</Tooltip.Trigger>
        <Tooltip.Popup>Refunds the full amount</Tooltip.Popup>
      </Tooltip.Root>
    </Tooltip.Provider>,
  );

  await expect
    .element(screen.getByText('Refunds the full amount'))
    .not.toBeInTheDocument();
  await userEvent.hover(screen.getByRole('button', { name: 'Refund' }));
  await expect
    .element(screen.getByText('Refunds the full amount'))
    .toBeVisible();

  await userEvent.unhover(screen.getByRole('button', { name: 'Refund' }));
  await expect
    .element(screen.getByText('Refunds the full amount'))
    .not.toBeInTheDocument();
});

test('the trigger can render as an icon button that keeps its name', async () => {
  const screen = await render(
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger
        render={
          <IconButton aria-label="Delete">
            <Icon icon={{ body: '', width: 24, height: 24 }} />
          </IconButton>
        }
      />
      <Tooltip.Popup>Delete order</Tooltip.Popup>
    </Tooltip.Root>,
  );

  const trigger = screen.getByRole('button', { name: 'Delete' });
  await expect.element(trigger).toBeVisible();
  expect(trigger.element().querySelector('svg')).not.toBeNull();
  await expect.element(screen.getByText('Delete order')).toBeVisible();
});

test('the popup cannot be restyled through className', async () => {
  const screen = await render(
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger>Refund</Tooltip.Trigger>
      {/* @ts-expect-error the popup cannot be restyled */}
      <Tooltip.Popup className="mt-4" DANGEROUS_className="mt-4">
        Refunds the full amount
      </Tooltip.Popup>
    </Tooltip.Root>,
  );

  await expect
    .element(screen.getByText('Refunds the full amount'))
    .not.toHaveClass('mt-4');
});

test('the popup cannot be restyled through style', async () => {
  const screen = await render(
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger>Refund</Tooltip.Trigger>
      {/* @ts-expect-error the popup cannot be restyled */}
      <Tooltip.Popup style={{ marginLeft: '16px' }}>
        Refunds the full amount
      </Tooltip.Popup>
    </Tooltip.Root>,
  );

  await expect
    .element(screen.getByText('Refunds the full amount'))
    .not.toHaveStyle({ marginLeft: '16px' });
});

test('the popup cannot be replaced through render', async () => {
  const screen = await render(
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger>Refund</Tooltip.Trigger>
      {/* @ts-expect-error the popup cannot be replaced */}
      <Tooltip.Popup render={<section data-testid="custom-popup" />}>
        Refunds the full amount
      </Tooltip.Popup>
    </Tooltip.Root>,
  );

  await expect
    .element(screen.getByText('Refunds the full amount'))
    .toBeVisible();
  await expect
    .element(screen.getByTestId('custom-popup'))
    .not.toBeInTheDocument();
});
