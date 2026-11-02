import { defineRule } from 'vite-plus/lint/plugins';
import { isClassListValue } from '../../class-names.ts';

export const preferCn = defineRule({
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Build conditional class lists with cn() instead of interpolating strings.',
    },
    messages: {
      template:
        'Don\'t interpolate class names in a template literal. Pass the parts to cn() instead, e.g. cn("flex", open && "gap-2").',
      concatenation:
        'Don\'t concatenate class names. Pass the parts to cn() instead, e.g. cn("flex", open && "gap-2").',
    },
    schema: [],
  },
  create(context) {
    return {
      TemplateLiteral(node) {
        if (node.expressions.length > 0 && isClassListValue(node)) {
          context.report({ node, messageId: 'template' });
        }
      },
      BinaryExpression(node) {
        // Only the outermost + of a chain like "a " + b + " c" reports.
        if (node.operator === '+' && isClassListValue(node)) {
          context.report({ node, messageId: 'concatenation' });
        }
      },
    };
  },
});
