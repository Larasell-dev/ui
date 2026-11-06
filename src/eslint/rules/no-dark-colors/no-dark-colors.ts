import { defineRule } from 'vite-plus/lint/plugins';
import { classLists } from '../../class-names.ts';
import { colorOf } from '../../colors.ts';

export const noDarkColors = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Semantic color tokens switch with the theme, so colors take no dark: variant.',
    },
    messages: {
      darkColor:
        '`{{className}}`: color tokens already switch in dark mode. Remove the dark: variant, or add a token if the role has none (see Foundations/Color).',
    },
  },
  create(context) {
    return classLists(context, (classNames) => {
      for (const { raw, variant, utility, node } of classNames) {
        if (variant.split(':').includes('dark') && colorOf(utility)) {
          context.report({
            node,
            messageId: 'darkColor',
            data: { className: raw },
          });
        }
      }
    });
  },
});
