import { Field } from '@base-ui/react/field';
import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Checkbox } from './checkbox.ts';

test('ticks and unticks when its label is clicked', async () => {
  // Tests load no CSS, so the empty, unticked box has no size to click on.
  const screen = await render(
    <Field.Root>
      <Checkbox.Label>
        <Checkbox.Indicator />
        Visible
      </Checkbox.Label>
    </Field.Root>,
  );

  const checkbox = screen.getByRole('checkbox', { name: 'Visible' });
  await expect.element(checkbox).not.toBeChecked();

  await screen.getByText('Visible').click();
  await expect.element(checkbox).toBeChecked();

  await screen.getByText('Visible').click();
  await expect.element(checkbox).not.toBeChecked();
});

test('submits its value with the form only while ticked', async () => {
  const screen = await render(
    <form data-testid="form">
      <Checkbox.Indicator
        aria-label="Visible"
        name="visible"
        value="1"
        defaultChecked
      />
    </form>,
  );
  const form = screen.getByTestId('form').element() as HTMLFormElement;

  expect(new FormData(form).get('visible')).toBe('1');

  await screen.getByRole('checkbox', { name: 'Visible' }).click();

  expect(new FormData(form).get('visible')).toBeNull();
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <Checkbox.Indicator aria-label="Visible" className="mt-4" />,
  );

  await expect
    .element(screen.getByRole('checkbox', { name: 'Visible' }))
    .not.toHaveClass('mt-4');
});

test('applies DANGEROUS_className as className', async () => {
  const screen = await render(
    <Checkbox.Indicator aria-label="Visible" DANGEROUS_className="mt-4" />,
  );

  const checkbox = screen.getByRole('checkbox', { name: 'Visible' });

  await expect.element(checkbox).toHaveClass('mt-4');
  await expect.element(checkbox).toHaveClass('border-border');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <Checkbox.Indicator aria-label="Visible" style={{ marginTop: 16 }} />,
  );

  await expect
    .element(screen.getByRole('checkbox', { name: 'Visible' }))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_style as style', async () => {
  const screen = await render(
    <Checkbox.Indicator
      aria-label="Visible"
      DANGEROUS_style={{ marginTop: '16px' }}
    />,
  );

  await expect
    .element(screen.getByRole('checkbox', { name: 'Visible' }))
    .toHaveStyle({ marginTop: '16px' });
});
