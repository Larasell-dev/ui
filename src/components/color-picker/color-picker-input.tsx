import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import { useState, type ComponentProps, type KeyboardEvent } from 'react';
import { isHex } from './color.ts';
import {
  useColorPicker,
  type ColorPickerState,
} from './color-picker-context.ts';

type ColorPickerInputProps = Omit<
  ComponentProps<'input'>,
  'value' | 'defaultValue'
> & {
  render?: useRender.RenderProp<ColorPickerState>;
};

/**
 * A text field for the colour as #rrggbb or #rrggbbaa, unstyled. It sets the colour on Enter or
 * blur; text that isn't a colour goes back to the last one, and empty clears it.
 * Wrap the panel's `<Input>` with `render`, e.g. to put the trigger in its prefix.
 */
export function ColorPickerInput({ render, ...props }: ColorPickerInputProps) {
  const { value, open, setValue } = useColorPicker('Input');
  const [text, setText] = useState(value);
  const [seen, setSeen] = useState(value);
  if (seen !== value) {
    setSeen(value);
    setText(value);
  }

  const commit = () => {
    const trimmed = text.trim();
    const next =
      trimmed === '' ? '' : isHex(trimmed) ? trimmed.toLowerCase() : value;
    setText(next);
    setValue(next);
  };

  return useRender({
    render,
    defaultTagName: 'input',
    state: { value, open },
    props: mergeProps<'input'>(
      {
        type: 'text',
        value: text,
        autoComplete: 'off',
        spellCheck: false,
        onChange: (event) => setText(event.target.value),
        onBlur: commit,
        onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key !== 'Enter') return;
          // Sets the colour instead of submitting the form.
          event.preventDefault();
          commit();
        },
      },
      props,
    ),
  });
}
