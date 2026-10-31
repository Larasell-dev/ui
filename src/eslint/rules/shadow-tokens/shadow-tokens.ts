import { defineRule } from 'vite-plus/lint/plugins';
import { classLists } from '../../class-names.ts';
import { planes } from '../../elevation.ts';

export const shadowTokens = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Shadows come from the elevation tokens: shadow-raised, shadow-popover and shadow-elevated.',
    },
    messages: {
      rawShadow:
        '`{{className}}` is not an elevation shadow. Use shadow-raised, shadow-popover or shadow-elevated (see Foundations/Elevation).',
    },
  },
  create(context) {
    return classLists(context, (classNames) => {
      for (const { raw, utility, node } of classNames) {
        const shadow = utility === 'shadow' || utility.startsWith('shadow-');
        if (shadow && !(utility in planes) && utility !== 'shadow-none') {
          context.report({
            node,
            messageId: 'rawShadow',
            data: { className: raw },
          });
        }
      }
    });
  },
});
