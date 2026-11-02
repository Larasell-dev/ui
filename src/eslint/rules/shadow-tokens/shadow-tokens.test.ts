import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vite-plus/test';
import { shadowTokens } from './shadow-tokens.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
});

const popover = 'border border-border bg-elevated bg-clip-padding';
ruleTester.run('shadow-tokens', shadowTokens, {
  valid: [
    `<div className="${popover} shadow-popover" />`,
    `<div className="${popover} shadow-elevated" />`,
    `<li className="border bg-surface bg-clip-padding shadow-raised" />`,
    `<div className="shadow-none" />`,
    // Other utilities that only share the word.
    `<img className="drop-shadow-md text-shadow-sm" />`,
    // Only class names are checked, not every string.
    `const label = 'shadow-lg';`,
    `<p title="shadow-lg" />`,
  ],
  invalid: [
    {
      code: `<div className="${popover} shadow-md" />`,
      errors: [{ messageId: 'rawShadow', data: { className: 'shadow-md' } }],
    },
    {
      name: 'the bare shadow utility',
      code: `<div className="shadow" />`,
      errors: [{ messageId: 'rawShadow', data: { className: 'shadow' } }],
    },
    {
      name: 'with variants and the important modifier',
      code: `<div className="hover:dark:shadow-lg!" />`,
      errors: [
        {
          messageId: 'rawShadow',
          data: { className: 'hover:dark:shadow-lg!' },
        },
      ],
    },
    {
      name: 'arbitrary values and shadow colors',
      code: `<div className="shadow-[0_1px_red] shadow-black/10" />`,
      errors: [
        { messageId: 'rawShadow', data: { className: 'shadow-[0_1px_red]' } },
        { messageId: 'rawShadow', data: { className: 'shadow-black/10' } },
      ],
    },
    {
      name: 'in cn() inside a DANGEROUS_className',
      code: `<Button DANGEROUS_className={cn('p-2', open && 'shadow-sm')} />`,
      errors: [{ messageId: 'rawShadow' }],
    },
    {
      name: 'in a template literal',
      code: 'const a = <div className={`p-2 ${x} shadow-xl`} />;',
      errors: [{ messageId: 'rawShadow' }],
    },
    {
      name: 'in cn() and cva() outside of JSX',
      code: `const a = cn('shadow-md'); const b = cva('p-2', { variants: { x: { y: 'shadow-lg' } } });`,
      errors: [{ messageId: 'rawShadow' }, { messageId: 'rawShadow' }],
    },
    {
      name: 'in a variable named after a class name',
      code: `const className = 'flex shadow-lg';`,
      errors: [{ messageId: 'rawShadow' }],
    },
  ],
});
