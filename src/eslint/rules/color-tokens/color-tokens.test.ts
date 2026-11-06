/* oxlint-disable larasell/color-tokens -- the code under test is fixtures */
import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vite-plus/test';
import { colorTokens } from './color-tokens.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
});

ruleTester.run('color-tokens', colorTokens, {
  valid: [
    `<p className="text-base-primary hover:bg-state-hover border-base-subtle" />`,
    `<div className="bg-action-negative-primary-default ring-intent-info-subtle outline-focus-default" />`,
    // Utilities that share a prefix with a color but take none.
    `<p className="text-base text-sm text-left border-2 border-t bg-clip-padding ring-1 ring-inset outline-none" />`,
    `<div className="bg-transparent text-inherit border-current" />`,
    `<div className="bg-[image:repeating-linear-gradient(-45deg,var(--border-color-base-subtle)_0_1px,transparent_1px_6px)]" />`,
    `<rect fill="var(--background-color-intent-accent-strong)" />`,
    // Only class lists and color variables count, not every string.
    `const label = 'bg-mauve-100';`,
    `<p title="text-red-500" />`,
  ],
  invalid: [
    {
      code: `<p className="text-mauve-950" />`,
      errors: [
        { messageId: 'primitive', data: { className: 'text-mauve-950' } },
      ],
    },
    {
      name: 'variants, opacity and the important modifier',
      code: `<div className="hover:bg-primary-500/15 data-dragging:bg-white!" />`,
      errors: [
        {
          messageId: 'primitive',
          data: { className: 'hover:bg-primary-500/15' },
        },
        {
          messageId: 'primitive',
          data: { className: 'data-dragging:bg-white!' },
        },
      ],
    },
    {
      name: 'side borders and rings',
      code: `<div className={cn('[button~&]:border-l-red-800', 'ring-sky-200')} />`,
      errors: [{ messageId: 'primitive' }, { messageId: 'primitive' }],
    },
    {
      name: 'arbitrary colors',
      code: `<div className="bg-[#fff] text-[oklch(0.5_0.1_8)] bg-[repeating-conic-gradient(var(--color-mauve-300)_0_25%,transparent_0_50%)]" />`,
      errors: [
        { messageId: 'literal' },
        { messageId: 'literal' },
        { messageId: 'literal' },
      ],
    },
    {
      name: 'a palette variable in an arbitrary property',
      code: `<div className="[--focus-ring-color:var(--color-red-500)]" />`,
      errors: [{ messageId: 'literal' }],
    },
    {
      name: 'a palette variable outside a class list',
      code: `<rect fill="var(--color-primary-500)" style={{ color: 'var(--color-mauve-50)' }} />`,
      errors: [
        {
          messageId: 'primitiveVariable',
          data: { variable: '--color-primary-500' },
        },
        {
          messageId: 'primitiveVariable',
          data: { variable: '--color-mauve-50' },
        },
      ],
    },
  ],
});
