import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vite-plus/test';
import { planeTokens } from './plane-tokens.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
});

const popover = 'border border-border bg-elevated bg-clip-padding';
ruleTester.run('plane-tokens', planeTokens, {
  valid: [
    `<div className="${popover} shadow-popover" />`,
    `<div className={cn('border border-border bg-clip-padding', 'bg-elevated shadow-elevated')} />`,
    // A drawer's border is on its inner edge only.
    `<div className="border-r bg-elevated bg-clip-padding shadow-elevated" />`,
    // A dragged item is raised only while dragging.
    `<li className="border bg-surface bg-clip-padding data-dragging:shadow-raised" />`,
    `<div className="bg-overlay backdrop-blur-overlay" />`,
    `<div className="border border-border bg-surface" />`,
    // Form controls aren't planes.
    `<input className="border bg-white dark:bg-mauve-900" />`,
    // The plane rule leaves raw shadows to shadow-tokens.
    `<div className="bg-white shadow-lg" />`,
  ],
  invalid: [
    {
      name: 'a popover shadow on a raw background',
      code: `<div className="border bg-white bg-clip-padding shadow-popover dark:bg-mauve-900" />`,
      errors: [
        {
          messageId: 'wrongPlane',
          data: { shadow: 'shadow-popover', background: 'bg-elevated' },
        },
      ],
    },
    {
      name: 'a raised shadow on the elevated plane',
      code: `<div className="border bg-elevated bg-clip-padding shadow-raised" />`,
      errors: [
        {
          messageId: 'wrongPlane',
          data: { shadow: 'shadow-raised', background: 'bg-surface' },
        },
      ],
    },
    {
      name: 'a shadow without any background',
      code: `<div className="border bg-clip-padding shadow-elevated" />`,
      errors: [{ messageId: 'wrongPlane' }],
    },
    {
      name: 'a plane background under another variant only',
      code: `<li className="border bg-clip-padding hover:bg-surface data-dragging:shadow-raised" />`,
      errors: [{ messageId: 'wrongPlane' }],
    },
    {
      name: 'a border color is not a border',
      code: `<div className="border-border bg-elevated bg-clip-padding shadow-elevated" />`,
      errors: [
        { messageId: 'missingBorder', data: { shadow: 'shadow-elevated' } },
      ],
    },
    {
      code: `<div className="border bg-elevated shadow-popover" />`,
      errors: [
        { messageId: 'missingClip', data: { shadow: 'shadow-popover' } },
      ],
    },
    {
      name: 'a shadow on the overlay',
      code: `<div className="bg-overlay backdrop-blur-overlay shadow-elevated" />`,
      errors: [{ messageId: 'overlayShadow' }],
    },
    {
      name: 'a raw scrim',
      code: `<Dialog.Backdrop className="fixed inset-0 bg-mauve-950/40 backdrop-blur-sm" />`,
      errors: [
        { messageId: 'rawScrim', data: { className: 'backdrop-blur-sm' } },
      ],
    },
    {
      name: 'a raw scrim blur on the overlay',
      code: `<div className="bg-overlay backdrop-blur-[2px]" />`,
      errors: [
        { messageId: 'rawScrim', data: { className: 'backdrop-blur-[2px]' } },
      ],
    },
    {
      name: 'a dark override of a plane background',
      code: `<div className="border bg-surface dark:bg-mauve-950" />`,
      errors: [
        {
          messageId: 'darkOverride',
          data: { background: 'bg-surface', className: 'dark:bg-mauve-950' },
        },
      ],
    },
  ],
});
