import DeleteBinLine from '@iconify-icons/ri/delete-bin-line';
import EyeOffLine from '@iconify-icons/ri/eye-off-line';
import PencilLine from '@iconify-icons/ri/pencil-line';
import preview from '../../../.storybook/preview.tsx';
import { Button } from '../form/button/button.tsx';
import { IconButton } from '../form/icon-button/icon-button.tsx';
import { Icon } from '../icon/icon.tsx';
import { Tooltip } from './tooltip.ts';

const meta = preview.meta({
  title: 'Molecules/Tooltip',
  component: Tooltip.Root,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 64 }}>
        <Story />
      </div>
    ),
  ],
});

/** Shows on hover or keyboard focus. The trigger renders as an icon button. */
export const Default = meta.story({
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <IconButton variant="secondary" aria-label="Delete">
            <Icon icon={DeleteBinLine} />
          </IconButton>
        }
      />
      <Tooltip.Popup>Delete order</Tooltip.Popup>
    </Tooltip.Root>
  ),
});

/** Open on load, to review the popup on its own. */
export const Open = meta.story({
  render: () => (
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger render={<Button variant="secondary" />}>
        Refund
      </Tooltip.Trigger>
      <Tooltip.Popup>Refunds the full amount to the card</Tooltip.Popup>
    </Tooltip.Root>
  ),
});

/** The popup can sit on any side of its trigger; the arrow follows. */
export const Sides = meta.story({
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 96,
        gridTemplateColumns: 'repeat(2, auto)',
      }}
    >
      {(['top', 'right', 'left', 'bottom'] as const).map((side) => (
        <Tooltip.Root key={side} open>
          <Tooltip.Trigger render={<Button variant="secondary" />}>
            {side}
          </Tooltip.Trigger>
          <Tooltip.Popup side={side}>On the {side}</Tooltip.Popup>
        </Tooltip.Root>
      ))}
    </div>
  ),
});

/**
 * In a provider, once one tooltip is shown, moving to the next shows it
 * without the delay.
 */
export const Group = meta.story({
  render: () => (
    <Tooltip.Provider>
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { label: 'Edit', icon: PencilLine },
          { label: 'Hide', icon: EyeOffLine },
          { label: 'Delete', icon: DeleteBinLine },
        ].map(({ label, icon }) => (
          <Tooltip.Root key={label}>
            <Tooltip.Trigger
              render={
                <IconButton variant="secondary" aria-label={label}>
                  <Icon icon={icon} />
                </IconButton>
              }
            />
            <Tooltip.Popup>{label}</Tooltip.Popup>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  ),
});
