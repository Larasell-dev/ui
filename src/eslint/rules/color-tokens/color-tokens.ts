import type { ESTree } from 'vite-plus/lint/plugins';
import { defineRule } from 'vite-plus/lint/plugins';
import { classLists, isInClassList } from '../../class-names.ts';
import { colorOf, primitiveVariable } from '../../colors.ts';

export const colorTokens = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Colors come from the semantic tokens, never from the palette, so they work in both themes and keep their contrast.',
    },
    messages: {
      primitive:
        '`{{className}}` uses a palette color. Use the semantic token for its role, e.g. text-base-secondary or bg-state-hover (see Foundations/Color).',
      literal:
        '`{{className}}` writes out a color. Use the semantic token for its role (see Foundations/Color).',
      primitiveVariable:
        '`{{variable}}` is a palette color. Use the semantic token for its role, e.g. var(--background-color-base-surface) (see Foundations/Color).',
    },
  },
  create(context) {
    const checkString = (node: ESTree.Node, text: string) => {
      const match = primitiveVariable.exec(text);
      if (match && !isInClassList(node)) {
        context.report({
          node,
          messageId: 'primitiveVariable',
          data: { variable: match[0] },
        });
      }
    };

    return {
      ...classLists(context, (classNames) => {
        for (const { raw, utility, node } of classNames) {
          const color = colorOf(utility);
          const kind =
            color?.kind === 'primitive' || color?.kind === 'literal'
              ? color.kind
              : // An arbitrary property, e.g. `[--focus-ring-color:var(--color-red-500)]`.
                primitiveVariable.test(utility)
                ? 'literal'
                : null;
          if (kind) {
            context.report({
              node,
              messageId: kind,
              data: { className: raw },
            });
          }
        }
      }),
      // Inline styles, SVG attributes and other strings outside class lists.
      Literal(node: ESTree.StringLiteral) {
        if (typeof node.value === 'string') checkString(node, node.value);
      },
      TemplateElement(node: ESTree.TemplateElement) {
        checkString(node, node.value.cooked ?? node.value.raw);
      },
    };
  },
});
