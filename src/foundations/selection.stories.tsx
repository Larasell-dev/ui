import { expect } from 'storybook/test';
import preview from '../../.storybook/preview.tsx';
import { Input } from '../components/form/input/input.tsx';

const meta = preview.meta({
  title: 'Foundations/Selection',
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="flex max-w-prose flex-col gap-6">
      <div>
        <p className="type-label-md text-mauve-950">Not selectable (default)</p>
        <p className="type-body-md mt-2 text-mauve-950">
          Text selection is disabled globally. Try to select this paragraph.
        </p>
      </div>
      <div>
        <p className="type-label-md text-mauve-950">
          Selectable with <code className="type-mono-sm">select-text</code>
        </p>
        <p className="type-body-md mt-2 text-mauve-950 select-text">
          This paragraph opts back into text selection, so it shows the
          selection color.
        </p>
      </div>
      <div>
        <p className="type-label-md text-mauve-950">Input</p>
        <div className="mt-2">
          <Input aria-label="Example" defaultValue="Inputs stay selectable" />
        </div>
      </div>
    </div>
  ),
});

export const Default = meta.story();

/**
 * Selects the whole page with Ctrl+A. Only text that opts back into selection
 * shows the selection color.
 */
export const SelectAll = meta.story({
  play: async ({ userEvent }) => {
    await userEvent.keyboard('{Control>}a{/Control}');

    await expect(window.getSelection()?.toString()).toContain(
      'This paragraph opts back into text selection',
    );
  },
});

/**
 * Focuses the input and selects its value.
 */
export const SelectedInput = meta.story({
  play: async ({ canvas }) => {
    const input = canvas.getByRole<HTMLInputElement>('textbox');

    input.focus();
    input.select();

    await expect(input).toHaveFocus();
    await expect(input.selectionEnd).toBe(input.value.length);
  },
});
