import { Field as BaseField } from '@base-ui/react/field';
import { useState } from 'react';
import { expect } from 'storybook/test';
import preview from '../../../../.storybook/preview.tsx';
import { Input } from '../input/input.tsx';
import { InheritableLabel } from './inheritable-label.tsx';

const meta = preview.meta({
  title: 'Atoms/InheritableLabel',
  component: InheritableLabel,
  parameters: { layout: 'centered' },
});

/** A variant's weight: linked, it shows the product's value read only; unlinked, its own. */
function WeightField({ initial }: { initial: boolean }) {
  const [inherited, setInherited] = useState(initial);
  const [own, setOwn] = useState('');
  return (
    <BaseField.Root className="flex w-72 flex-col gap-1.5">
      <InheritableLabel
        inherited={inherited}
        onInheritedChange={setInherited}
        linkLabel="Use the product's value"
        unlinkLabel="Use an own value"
      >
        Weight
      </InheritableLabel>
      <Input
        value={inherited ? '250' : own}
        readOnly={inherited}
        onChange={(event) => setOwn(event.target.value)}
      />
    </BaseField.Root>
  );
}

export const Inherited = meta.story({
  render: () => <WeightField initial />,
});

export const Overridden = meta.story({
  render: () => <WeightField initial={false} />,
});

/** Unlinks the field, types an own value, then links it again. */
export const Toggle = meta.story({
  render: () => <WeightField initial />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Weight' });
    await expect(input).toHaveValue('250');
    await expect(input).toHaveAttribute('readonly');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Use an own value' }),
    );
    await expect(input).not.toHaveAttribute('readonly');
    await userEvent.type(input, '300');
    await expect(input).toHaveValue('300');

    const link = canvas.getByRole('button', {
      name: "Use the product's value",
    });
    await expect(link).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(link);
    await expect(input).toHaveValue('250');
  },
});
