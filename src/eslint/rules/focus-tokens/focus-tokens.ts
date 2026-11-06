import { defineRule } from 'vite-plus/lint/plugins';
import { classLists } from '../../class-names.ts';
import { colorOf } from '../../colors.ts';

/** Variants that apply only while something has focus, e.g. `has-[a:focus-visible]`. */
const isFocusVariant = (variant: string) => /focus/.test(variant);

export const focusTokens = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'The focus colors mark keyboard focus and nothing else, and focus is always marked with them.',
    },
    messages: {
      focusOutsideFocus:
        '`{{className}}` is a focus color outside a focus state. Use it only for focus, e.g. focus-visible:{{utility}}; for hover, selection or drop targets use their state tokens.',
      otherColorOnFocus:
        '`{{className}}` marks focus with another color. Use the focus-ring utility or outline-focus.',
    },
  },
  create(context) {
    return classLists(context, (classNames) => {
      for (const { raw, variant, utility, node } of classNames) {
        const color = colorOf(utility);
        if (color === null) continue;
        const focusColor = /^focus(-|$)/.test(color.value);
        const outline =
          color.property === 'outline' || color.property === 'ring';
        if (focusColor && !isFocusVariant(variant)) {
          context.report({
            node,
            messageId: 'focusOutsideFocus',
            data: { className: raw, utility },
          });
        } else if (!focusColor && outline && isFocusVariant(variant)) {
          context.report({
            node,
            messageId: 'otherColorOnFocus',
            data: { className: raw },
          });
        }
      }
    });
  },
});
