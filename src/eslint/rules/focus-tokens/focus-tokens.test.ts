import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vite-plus/test';
import { focusTokens } from './focus-tokens.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
});

ruleTester.run('focus-tokens', focusTokens, {
  valid: [
    `<a className="focus-visible:focus-ring" />`,
    `<tr className="has-[a:focus-visible]:outline-focus-default" />`,
    `<li className="data-drop-target:outline-state-selected-accent" />`,
    // A focus color as text isn't an outline.
    `<input className="focus:text-base-primary focus:bg-state-hover" />`,
  ],
  invalid: [
    {
      name: 'a focus color as decoration',
      code: `<li className="data-drop-target:outline-focus-default" />`,
      errors: [{ messageId: 'focusOutsideFocus' }],
    },
    {
      name: 'another color marking focus',
      code: `<a className="focus-visible:outline-intent-negative" />`,
      errors: [{ messageId: 'otherColorOnFocus' }],
    },
  ],
});
