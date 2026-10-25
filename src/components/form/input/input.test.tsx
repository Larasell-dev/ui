import { expect, test } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { Input } from './input.tsx';
import '../../../../.storybook/tailwind.css';

test('accepts typed text', async () => {
  const screen = await render(<Input aria-label="Email" />);

  const input = screen.getByRole('textbox', { name: 'Email' });
  await input.fill('ada@example.com');

  await expect.element(input).toHaveValue('ada@example.com');
});

test('renders the prefix and suffix inside the container around the input', async () => {
  const screen = await render(
    <Input
      aria-label="Website"
      prefix={<span>https://</span>}
      suffix={<button type="button">Copy</button>}
    />,
  );

  const input = screen.getByRole('textbox', { name: 'Website' }).element();
  const prefix = screen.getByText('https://').element();
  const suffix = screen.getByRole('button', { name: 'Copy' }).element();
  const container = input.parentElement!;

  expect(container.contains(prefix)).toBe(true);
  expect(container.contains(suffix)).toBe(true);
  expect(
    prefix.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(
    input.compareDocumentPosition(suffix) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test('draws the focus outline on the container, not the input', async () => {
  const screen = await render(
    <Input aria-label="Website" prefix={<span>https://</span>} />,
  );

  const input = screen.getByRole('textbox', { name: 'Website' });
  const container = input.element().parentElement!;
  expect(getComputedStyle(container).outlineStyle).toBe('none');

  await input.click();

  await expect.element(input).toHaveFocus();
  expect(getComputedStyle(container).outlineStyle).toBe('solid');
  expect(getComputedStyle(input.element()).outlineStyle).toBe('none');
});

test('does not draw the container outline when a suffix button has focus', async () => {
  const screen = await render(
    <Input aria-label="Website" suffix={<button type="button">Copy</button>} />,
  );

  const input = screen.getByRole('textbox', { name: 'Website' });
  screen.getByRole('button', { name: 'Copy' }).element().focus();

  expect(getComputedStyle(input.element().parentElement!).outlineStyle).toBe(
    'none',
  );
});

test('fades the text on the side it overflows', async () => {
  const screen = await render(
    <div style={{ width: 200 }}>
      <Input
        aria-label="Note"
        defaultValue="A value far too long to fit inside this narrow input"
      />
    </div>,
  );

  const input = screen.getByRole('textbox', { name: 'Note' }).element();
  const fadeFrom = (side: 'l' | 'r') =>
    getComputedStyle(input).getPropertyValue(`--scroll-mask-${side}-from`);

  // At the start, only the end overflows.
  await expect.poll(() => fadeFrom('r')).toBe('80%');
  expect(fadeFrom('l')).toBe('100%');

  input.scrollLeft = input.scrollWidth;

  // At the end, only the start overflows.
  await expect.poll(() => fadeFrom('l')).toBe('80%');
  expect(fadeFrom('r')).toBe('100%');

  // The fade is on the input alone, so the prefix and suffix never fade.
  expect(getComputedStyle(input.parentElement!).maskImage).toBe('none');
});

test('does not accept className', async () => {
  const screen = await render(
    // @ts-expect-error className is blocked; use DANGEROUS_className
    <Input aria-label="Email" className="mt-4" />,
  );

  await expect
    .element(screen.getByRole('textbox', { name: 'Email' }))
    .not.toHaveClass('mt-4');
});

test('applies DANGEROUS_className to the container', async () => {
  const screen = await render(
    <Input aria-label="Email" DANGEROUS_className="mt-4" />,
  );

  const input = screen.getByRole('textbox', { name: 'Email' });
  const container = input.element().parentElement!;

  expect(container).toHaveClass('mt-4');
  expect(container).toHaveClass('border-border');
  await expect.element(input).not.toHaveClass('mt-4');
});

test('does not accept style', async () => {
  const screen = await render(
    // @ts-expect-error style is blocked; use DANGEROUS_style
    <Input aria-label="Email" style={{ marginTop: 16 }} />,
  );

  await expect
    .element(screen.getByRole('textbox', { name: 'Email' }))
    .not.toHaveStyle({ marginTop: '16px' });
});

test('applies DANGEROUS_style to the container', async () => {
  const screen = await render(
    <Input aria-label="Email" DANGEROUS_style={{ marginTop: '16px' }} />,
  );

  const input = screen.getByRole('textbox', { name: 'Email' });

  expect(input.element().parentElement).toHaveStyle({ marginTop: '16px' });
});
