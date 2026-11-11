import { useState } from 'react';
import { expect, screen, waitFor } from 'storybook/test';
import preview from '../../../.storybook/preview.tsx';
import { Input } from '../form/input/input.tsx';
import { ColorPicker } from './color-picker.ts';

const meta = preview.meta({
  title: 'Molecules/ColorPicker',
  parameters: { layout: 'centered' },
});

function SwatchField({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  return (
    <ColorPicker.Root value={value} onValueChange={setValue}>
      <ColorPicker.Input
        aria-label="Swatch colour"
        placeholder="#000000"
        render={(props, state) => (
          <Input
            {...props}
            prefix={
              <ColorPicker.Trigger
                aria-label="Pick a colour"
                className="border-base-strong focus-visible:focus-ring size-5 shrink-0 cursor-pointer border outline-none"
                style={{ backgroundColor: state.value || undefined }}
              />
            }
          />
        )}
      />
      <ColorPicker.Popup />
    </ColorPicker.Root>
  );
}

/** A text field to type the colour, with a swatch that opens the picker. */
export const Default = meta.story({
  render: () => <SwatchField initial="#1e6fd9" />,
});

/** Types a colour, then opens the picker and changes the hue with the keyboard. */
export const TypeAndPick = meta.story({
  render: () => <SwatchField initial="#1e6fd9" />,
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole('textbox', { name: 'Swatch colour' });
    await userEvent.clear(field);
    await userEvent.type(field, '#ff0000{Enter}');
    await expect(field).toHaveValue('#ff0000');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Pick a colour' }),
    );
    const hue = await screen.findByRole('slider', { name: 'Hue' });
    await waitFor(() => expect(hue).toBeVisible());
    hue.focus();
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await waitFor(() => expect(field).not.toHaveValue('#ff0000'));
  },
});

/** Without a colour yet. */
export const Empty = meta.story({
  render: () => <SwatchField initial="" />,
});

/** The popup alone, open, with a translucent colour so the checkerboard shows. */
export const Open = meta.story({
  render: () => (
    <ColorPicker.Root defaultValue="#e0457b99" defaultOpen>
      <ColorPicker.Trigger
        aria-label="Pick a colour"
        className="border-base-strong size-8 border"
        style={{ backgroundColor: '#e0457b99' }}
      />
      <ColorPicker.Popup />
    </ColorPicker.Root>
  ),
});

/** Translated accessible names, passed to the root. */
export const TranslatedLabels = meta.story({
  render: () => (
    <ColorPicker.Root
      defaultValue="#2e8b57"
      defaultOpen
      labels={{
        area: 'Sättigung und Helligkeit',
        hue: 'Farbton',
        alpha: 'Deckkraft',
        copyHex: 'Hex kopieren',
      }}
    >
      <ColorPicker.Trigger
        aria-label="Farbe wählen"
        className="border-base-strong size-8 border"
        style={{ backgroundColor: '#2e8b57' }}
      />
      <ColorPicker.Popup />
    </ColorPicker.Root>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('slider', { name: 'Farbton' }),
    ).toBeInTheDocument();
    await expect(
      screen.getByRole('button', { name: 'Hex kopieren' }),
    ).toBeInTheDocument();
  },
});
