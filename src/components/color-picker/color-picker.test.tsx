import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { ClipboardProvider, TestClipboard } from '../../utils/clipboard.tsx';
import { ColorPicker } from './color-picker.ts';

test('uncontrolled, it submits the typed colour and passes it to the trigger', async () => {
  // Arrange
  const screen = await render(
    <form data-testid="form">
      <ColorPicker.Root name="swatch" defaultValue="#112233">
        <ColorPicker.Input aria-label="Colour" />
        <ColorPicker.Trigger
          render={(props, { value }) => (
            <button {...props} data-testid="trigger" data-color={value} />
          )}
        />
      </ColorPicker.Root>
    </form>,
  );
  const form = screen.getByTestId('form').element() as HTMLFormElement;

  // Act
  await userEvent.fill(
    screen.getByRole('textbox', { name: 'Colour' }),
    '#AABBCC',
  );
  await userEvent.keyboard('{Enter}');

  // Assert
  expect(new FormData(form).get('swatch')).toBe('#aabbcc');
  await expect
    .element(screen.getByTestId('trigger'))
    .toHaveAttribute('data-color', '#aabbcc');
});

test('keeps the last valid colour when the typed text is not one', async () => {
  // Arrange
  const onValueChange = vi.fn();
  const screen = await render(
    <ColorPicker.Root defaultValue="#112233" onValueChange={onValueChange}>
      <ColorPicker.Input aria-label="Colour" />
    </ColorPicker.Root>,
  );
  const input = screen.getByRole('textbox', { name: 'Colour' });

  // Act
  await userEvent.fill(input, 'red');
  await userEvent.tab();

  // Assert
  expect(onValueChange).not.toHaveBeenCalled();
  await expect.element(input).toHaveValue('#112233');
});

test('an empty input clears the colour', async () => {
  // Arrange
  const onValueChange = vi.fn();
  const screen = await render(
    <ColorPicker.Root defaultValue="#112233" onValueChange={onValueChange}>
      <ColorPicker.Input aria-label="Colour" />
    </ColorPicker.Root>,
  );

  // Act
  await userEvent.clear(screen.getByRole('textbox', { name: 'Colour' }));
  await userEvent.tab();

  // Assert
  expect(onValueChange).toHaveBeenCalledWith('');
});

test('the trigger opens the popup, whose area moves saturation with the arrow keys', async () => {
  // Arrange
  const onValueChange = vi.fn();
  const screen = await render(
    <ColorPicker.Root value="#808080" onValueChange={onValueChange}>
      <ColorPicker.Trigger aria-label="Pick a colour" />
      <ColorPicker.Popup />
    </ColorPicker.Root>,
  );

  // Act
  await userEvent.click(screen.getByRole('button', { name: 'Pick a colour' }));
  (
    screen
      .getByRole('slider', { name: 'Saturation and brightness' })
      .element() as HTMLElement
  ).focus();
  await userEvent.keyboard('{ArrowRight}');

  // Assert: grey gains saturation, so red stops equalling green and blue.
  const [hex] = onValueChange.mock.calls.at(-1)!;
  expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  expect(hex.slice(1, 3)).not.toBe(hex.slice(3, 5));
});

test('the hue slider keeps saturation and brightness', async () => {
  // Arrange
  const onValueChange = vi.fn();
  const screen = await render(
    <ColorPicker.Root
      defaultValue="#ff0000"
      onValueChange={onValueChange}
      defaultOpen
    >
      <ColorPicker.Popup />
    </ColorPicker.Root>,
  );

  // Act
  await expect
    .element(screen.getByRole('slider', { name: 'Hue' }))
    .toBeInTheDocument();
  (
    screen.getByRole('slider', { name: 'Hue' }).element() as HTMLElement
  ).focus();
  await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');

  // Assert: still fully saturated and bright, now with some green.
  const [hex] = onValueChange.mock.calls.at(-1)!;
  expect(hex.slice(1, 3)).toBe('ff');
  expect(hex.slice(5, 7)).toBe('00');
  expect(hex.slice(3, 5)).not.toBe('00');
});

test("the popup's channel inputs set the colour", async () => {
  // Arrange
  const onValueChange = vi.fn();
  const screen = await render(
    <ColorPicker.Root
      defaultValue="#000000"
      onValueChange={onValueChange}
      defaultOpen
    >
      <ColorPicker.Popup />
    </ColorPicker.Root>,
  );

  // Act
  await userEvent.fill(screen.getByRole('textbox', { name: 'Green' }), '255');
  await userEvent.keyboard('{Enter}');

  // Assert
  expect(onValueChange).toHaveBeenLastCalledWith('#00ff00');
});

test('the alpha slider adds an alpha to the hex', async () => {
  // Arrange
  const onValueChange = vi.fn();
  const screen = await render(
    <ColorPicker.Root
      defaultValue="#00ff00"
      onValueChange={onValueChange}
      defaultOpen
    >
      <ColorPicker.Popup />
    </ColorPicker.Root>,
  );

  // Act
  await expect
    .element(screen.getByRole('slider', { name: 'Alpha' }))
    .toBeInTheDocument();
  (
    screen.getByRole('slider', { name: 'Alpha' }).element() as HTMLElement
  ).focus();
  await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}');

  // Assert: 90% opaque green.
  expect(onValueChange).toHaveBeenLastCalledWith('#00ff00e6');
});

test('the LCH inputs set the colour in OKLCH', async () => {
  // Arrange
  const onValueChange = vi.fn();
  const screen = await render(
    <ColorPicker.Root
      defaultValue="#ff0000"
      onValueChange={onValueChange}
      defaultOpen
    >
      <ColorPicker.Popup />
    </ColorPicker.Root>,
  );

  // Act: no chroma leaves a grey of red's lightness.
  await userEvent.fill(
    screen.getByRole('textbox', { name: 'LCH chroma' }),
    '0',
  );
  await userEvent.keyboard('{Enter}');

  // Assert
  const [hex] = onValueChange.mock.calls.at(-1)!;
  expect(hex.slice(1, 3)).toBe(hex.slice(3, 5));
  expect(hex.slice(3, 5)).toBe(hex.slice(5, 7));
  expect(hex).not.toBe('#000000');
});

test('each row copies its colour as CSS', async () => {
  // Arrange
  const clipboard = new TestClipboard();
  const screen = await render(
    <ClipboardProvider clipboard={clipboard}>
      <ColorPicker.Root defaultValue="#00988a" defaultOpen>
        <ColorPicker.Popup />
      </ColorPicker.Root>
    </ClipboardProvider>,
  );

  // Act
  await userEvent.click(screen.getByRole('button', { name: 'Copy RGB' }));
  await userEvent.click(screen.getByRole('button', { name: 'Copy hex' }));

  // Assert
  expect(clipboard.texts).toEqual(['rgb(0 152 138)', '#00988a']);
});

test('names its sliders, fields and copy buttons with the labels it is given', async () => {
  // Arrange
  const screen = await render(
    <ColorPicker.Root
      defaultValue="#ff0000"
      defaultOpen
      labels={{ hue: 'Farbton', copyHex: 'Hex kopieren', red: 'Rot' }}
    >
      <ColorPicker.Popup />
    </ColorPicker.Root>,
  );

  // Act
  const hue = screen.getByRole('slider', { name: 'Farbton' });

  // Assert
  await expect.element(hue).toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: 'Hex kopieren' }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole('textbox', { name: 'Rot' }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole('slider', { name: 'Alpha' }))
    .toBeInTheDocument();
});
