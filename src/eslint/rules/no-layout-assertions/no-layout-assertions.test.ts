import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vite-plus/test';
import { noLayoutAssertions } from './no-layout-assertions.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
});

ruleTester.run('no-layout-assertions', noLayoutAssertions, {
  valid: [
    // Measuring while rendering, e.g. to anchor a popup, isn't an assertion.
    `export const Story = meta.story({ render: () => <span onPointerDown={(e) => setAt(e.currentTarget.getBoundingClientRect())} /> });`,
    `test('opens', async () => { await expect(list).toBeVisible(); });`,
  ],
  invalid: [
    {
      name: 'in a play function',
      code: `export const Story = meta.story({ play: async () => { expect(list.getBoundingClientRect().left).toBe(0); } });`,
      errors: [
        { messageId: 'measured', data: { name: 'getBoundingClientRect' } },
      ],
    },
    {
      name: 'in a test',
      code: `test('is square', () => { const box = icon.getBoundingClientRect(); });`,
      errors: [{ messageId: 'measured' }],
    },
    {
      name: 'in a test.each',
      code: `test.each([1])('rects', () => { el.getClientRects(); });`,
      errors: [{ messageId: 'measured', data: { name: 'getClientRects' } }],
    },
  ],
});
