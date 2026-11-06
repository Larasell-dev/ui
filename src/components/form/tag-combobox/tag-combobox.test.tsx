import { useState } from 'react';
import { expect, test, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';
import { Field } from '../field/field.tsx';
import { TagCombobox } from './tag-combobox.ts';

function Currencies(props: Parameters<typeof TagCombobox.Root>[0]) {
  return (
    <TagCombobox.Root {...props}>
      <TagCombobox.Item value="USD" label="US Dollar (USD)">
        US Dollar <span data-testid="code">USD</span>
      </TagCombobox.Item>
      <TagCombobox.Item value="EUR" label="Euro (EUR)">
        Euro <span>EUR</span>
      </TagCombobox.Item>
      <TagCombobox.Item value="GBP">British Pound</TagCombobox.Item>
    </TagCombobox.Root>
  );
}

const picked = (form: HTMLFormElement) =>
  new FormData(form).getAll('currencies[]');

test('is named by its field and filters the items as the admin types', async () => {
  const screen = await render(
    <Field label="Currencies" name="currencies">
      <Currencies />
    </Field>,
  );

  const input = screen.getByRole('combobox', { name: 'Currencies' });
  await input.fill('eu');

  await expect
    .element(screen.getByRole('option', { name: 'Euro (EUR)' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('option', { name: 'US Dollar (USD)' }))
    .not.toBeInTheDocument();
});

test('takes its options as items, followed by any TagCombobox.Item children', async () => {
  const screen = await render(
    <form data-testid="form">
      <Field label="Currencies" name="currencies">
        <TagCombobox.Root
          items={[{ value: 'USD', label: 'US Dollar' }, { value: 'CHF' }]}
          defaultValue={['CHF']}
        >
          <TagCombobox.Item value="EUR" label="Euro (EUR)">
            Euro <span>EUR</span>
          </TagCombobox.Item>
        </TagCombobox.Root>
      </Field>
    </form>,
  );

  await screen.getByRole('combobox', { name: 'Currencies' }).click();
  await expect
    .element(screen.getByRole('listbox'))
    .toHaveTextContent('US DollarCHFEuro EUR');
  await screen.getByRole('option', { name: 'Euro (EUR)' }).click();

  expect(
    picked(screen.getByTestId('form').element() as HTMLFormElement),
  ).toEqual(['CHF', 'EUR']);
});

test('adds the highlighted item on Enter, keeps the list open and checks the item', async () => {
  const screen = await render(
    <form data-testid="form">
      <Field label="Currencies" name="currencies">
        <Currencies />
      </Field>
    </form>,
  );

  await screen.getByRole('combobox', { name: 'Currencies' }).fill('pound');
  await userEvent.keyboard('{Enter}');

  await expect.element(screen.getByRole('listbox')).toBeVisible();
  await expect
    .element(screen.getByRole('option', { name: 'British Pound' }))
    .toHaveAttribute('aria-selected', 'true');
  await expect
    .element(screen.getByRole('button', { name: 'Remove British Pound' }))
    .toBeVisible();
  expect(
    picked(screen.getByTestId('form').element() as HTMLFormElement),
  ).toEqual(['GBP']);
});

test('keeps the list open after a click, to pick more', async () => {
  const screen = await render(
    <Field label="Currencies" name="currencies">
      <Currencies />
    </Field>,
  );

  await screen.getByRole('combobox', { name: 'Currencies' }).click();
  await screen.getByRole('option', { name: 'Euro (EUR)' }).click();
  await screen.getByRole('option', { name: 'US Dollar (USD)' }).click();

  await expect.element(screen.getByRole('listbox')).toBeVisible();
  await expect
    .element(screen.getByRole('button', { name: 'Remove Euro (EUR)' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('button', { name: 'Remove US Dollar (USD)' }))
    .toBeVisible();
});

test("submits the picked items as name[] in the items' order", async () => {
  const screen = await render(
    <form data-testid="form">
      <Currencies name="currencies" defaultValue={['GBP', 'USD']} />
    </form>,
  );

  expect(
    picked(screen.getByTestId('form').element() as HTMLFormElement),
  ).toEqual(['USD', 'GBP']);
});

test("submits nothing without the brackets, so Inertia doesn't keep only the last value", async () => {
  const screen = await render(
    <form data-testid="form">
      <Field label="Currencies" name="currencies">
        <Currencies defaultValue={['USD', 'EUR']} />
      </Field>
    </form>,
  );

  const form = screen.getByTestId('form').element() as HTMLFormElement;
  expect([...new FormData(form).keys()]).toEqual([
    'currencies[]',
    'currencies[]',
  ]);
});

test('removes an item with its remove button', async () => {
  const screen = await render(
    <form data-testid="form">
      <Currencies
        name="currencies"
        aria-label="Currencies"
        defaultValue={['USD', 'EUR']}
      />
    </form>,
  );

  await screen.getByRole('button', { name: 'Remove US Dollar (USD)' }).click();

  expect(
    picked(screen.getByTestId('form').element() as HTMLFormElement),
  ).toEqual(['EUR']);
});

test('tells the form it changed, so Inertia marks it dirty', async () => {
  const onInput = vi.fn();
  const screen = await render(
    <form onInput={onInput}>
      <Currencies
        name="currencies"
        aria-label="Currencies"
        defaultValue={['USD']}
      />
    </form>,
  );

  await screen.getByRole('button', { name: 'Remove US Dollar (USD)' }).click();

  await vi.waitFor(() => expect(onInput).toHaveBeenCalled());
});

test('goes back to the checkboxes the form resets to', async () => {
  const screen = await render(
    <form data-testid="form">
      <Currencies
        name="currencies"
        aria-label="Currencies"
        defaultValue={['USD']}
      />
      <button type="reset">Reset</button>
    </form>,
  );

  await screen.getByRole('combobox', { name: 'Currencies' }).click();
  await screen.getByRole('option', { name: 'Euro (EUR)' }).click();
  await userEvent.keyboard('{Escape}');
  await screen.getByRole('button', { name: 'Reset' }).click();

  await expect
    .element(screen.getByRole('button', { name: 'Remove Euro (EUR)' }))
    .not.toBeInTheDocument();
  expect(
    picked(screen.getByTestId('form').element() as HTMLFormElement),
  ).toEqual(['USD']);
});

test('reads the reset checkboxes back even when the form re-renders on reset, as Inertia does', async () => {
  function Form() {
    const [value, setValue] = useState(['USD']);
    const [, setResets] = useState(0);
    return (
      <form data-testid="form" onReset={() => setResets((count) => count + 1)}>
        <Currencies
          name="currencies"
          aria-label="Currencies"
          value={value}
          onValueChange={setValue}
        />
      </form>
    );
  }
  const screen = await render(<Form />);

  await screen.getByRole('combobox', { name: 'Currencies' }).click();
  await screen.getByRole('option', { name: 'Euro (EUR)' }).click();
  await userEvent.keyboard('{Escape}');

  // What Inertia's reset does: tick the default checkboxes, then send reset.
  const form = screen.getByTestId('form').element() as HTMLFormElement;
  for (const input of form.querySelectorAll<HTMLInputElement>(
    'input[type=checkbox]',
  )) {
    input.checked = input.value === 'USD';
  }
  form.dispatchEvent(
    new CustomEvent('reset', { bubbles: true, cancelable: true }),
  );

  await expect
    .element(screen.getByRole('button', { name: 'Remove Euro (EUR)' }))
    .not.toBeInTheDocument();
  expect(picked(form)).toEqual(['USD']);
});

test('keeps the picked items when Escape is pressed with the list closed', async () => {
  const screen = await render(
    <form data-testid="form">
      <Currencies
        name="currencies"
        aria-label="Currencies"
        defaultValue={['USD', 'EUR']}
      />
    </form>,
  );

  await screen.getByRole('combobox', { name: 'Currencies' }).click();
  await userEvent.keyboard('{Escape}');
  await expect.element(screen.getByRole('listbox')).not.toBeInTheDocument();
  await userEvent.keyboard('{Escape}');

  expect(
    picked(screen.getByTestId('form').element() as HTMLFormElement),
  ).toEqual(['USD', 'EUR']);
});

test('follows a controlled value', async () => {
  const onValueChange = vi.fn();
  function Controlled() {
    const [value, setValue] = useState(['EUR']);
    return (
      <>
        <Currencies
          aria-label="Currencies"
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
        <button type="button" onClick={() => setValue(['USD'])}>
          Only dollars
        </button>
      </>
    );
  }
  const screen = await render(<Controlled />);

  await screen.getByRole('button', { name: 'Remove Euro (EUR)' }).click();
  expect(onValueChange).toHaveBeenLastCalledWith([]);

  await screen.getByRole('button', { name: 'Only dollars' }).click();
  await expect
    .element(screen.getByRole('button', { name: 'Remove US Dollar (USD)' }))
    .toBeVisible();
});

test('renders the items as given, e.g. with a less prominent code', async () => {
  const screen = await render(<Currencies aria-label="Currencies" />);

  await screen.getByRole('combobox', { name: 'Currencies' }).click();

  await expect
    .element(
      screen
        .getByRole('option', { name: 'US Dollar (USD)' })
        .getByTestId('code'),
    )
    .toHaveTextContent('USD');
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <TagCombobox.Root aria-label="Currencies" className="mt-4">
      {/* @ts-expect-error className is blocked; use DANGEROUS_className */}
      <TagCombobox.Item value="USD" className="mt-4">
        US Dollar
      </TagCombobox.Item>
    </TagCombobox.Root>,
  );

  const input = screen.getByRole('combobox', { name: 'Currencies' });
  expect(input.element().closest('[data-tag-combobox]')).not.toHaveClass(
    'mt-4',
  );
  await expect.element(input).not.toHaveClass('mt-4');

  await input.click();
  await expect
    .element(screen.getByRole('option', { name: 'US Dollar' }))
    .not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <TagCombobox.Root aria-label="Currencies" style={{ marginTop: 16 }}>
      {/* @ts-expect-error style is blocked; use DANGEROUS_style */}
      <TagCombobox.Item value="USD" style={{ marginTop: 16 }}>
        US Dollar
      </TagCombobox.Item>
    </TagCombobox.Root>,
  );

  const input = screen.getByRole('combobox', { name: 'Currencies' });
  expect(input.element().closest('[data-tag-combobox]')).not.toHaveStyle({
    marginTop: '16px',
  });

  await input.click();
  await expect
    .element(screen.getByRole('option', { name: 'US Dollar' }))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_className and DANGEROUS_style to the box and the item rows', async () => {
  const screen = await render(
    <TagCombobox.Root
      aria-label="Currencies"
      DANGEROUS_className="mt-4"
      DANGEROUS_style={{ marginTop: '16px' }}
    >
      <TagCombobox.Item
        value="USD"
        DANGEROUS_className="italic"
        DANGEROUS_style={{ paddingLeft: '24px' }}
      >
        US Dollar
      </TagCombobox.Item>
    </TagCombobox.Root>,
  );

  const input = screen.getByRole('combobox', { name: 'Currencies' });
  const box = input.element().closest('[data-tag-combobox]')!;
  expect(box).toHaveClass('mt-4');
  expect(box).toHaveClass('border-base-strong');
  expect(box).toHaveStyle({ marginTop: '16px' });
  await expect.element(input).not.toHaveClass('mt-4');

  await input.click();
  const option = screen.getByRole('option', { name: 'US Dollar' });
  await expect.element(option).toHaveClass('italic');
  await expect.element(option).toHaveStyle({ paddingLeft: '24px' });
});
