/* oxlint-disable larasell/color-tokens, larasell/no-dark-colors -- fixtures */
import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vite-plus/test';
import { noDarkColors } from './no-dark-colors.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
});

ruleTester.run('no-dark-colors', noDarkColors, {
  valid: [
    `<p className="text-base-primary" />`,
    // dark: on something that isn't a color.
    `<img className="dark:hidden dark:opacity-80 dark:text-sm" />`,
  ],
  invalid: [
    {
      code: `<p className="text-base-primary dark:text-base-secondary" />`,
      errors: [
        {
          messageId: 'darkColor',
          data: { className: 'dark:text-base-secondary' },
        },
      ],
    },
    {
      name: 'a palette color under nested variants',
      code: `<div className="dark:not-data-disabled:hover:bg-mauve-800" />`,
      errors: [{ messageId: 'darkColor' }],
    },
  ],
});
