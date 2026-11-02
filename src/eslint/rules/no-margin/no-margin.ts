import { defineRule, type ESTree } from 'vite-plus/lint/plugins';
import {
  classNamesOf,
  inlineStyles,
  isInClassList,
  parseClassName,
} from '../../class-names.ts';

/**
 * Tailwind margin utilities: m-4, mt-[3px], mbs-2, …, and arbitrary properties
 * like [margin-top:3px]. A leading "-" (-mt-2) or a negative value (mt-[-3px])
 * is a negative margin. mx-auto is allowed: it centers a block horizontally,
 * which gap or padding can't do.
 */
const marginUtility = /^(-?)m(?:[xytrblse]|b[se])?-(.+)$/;
const marginProperty = /^\[margin(?:-[a-z-]+)?:(.+)\]$/;

function isMarginClass(raw: string) {
  const { utility } = parseClassName(raw);
  if (utility === 'mx-auto') return false;
  const property = marginProperty.exec(utility);
  if (property) return !property[1].startsWith('-');
  const match = marginUtility.exec(utility);
  return match !== null && match[1] !== '-' && !match[2].startsWith('[-');
}

/** margin, marginTop, marginInline, 'margin-top', … */
const isMarginStyle = (name: string) => /^margin(?:[A-Z-]|$)/.test(name);

const isNegativeString = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .every((part) => part.startsWith('-'));

/** Only values that are negative as written pass: -4, -offset, '-4px', '-1rem -2rem'. */
function isNegative(value: ESTree.Node) {
  if (value.type === 'UnaryExpression' && value.operator === '-') return true;
  if (value.type === 'Literal') {
    if (typeof value.value === 'number') return value.value < 0;
    if (typeof value.value === 'string') return isNegativeString(value.value);
  }
  if (value.type === 'TemplateLiteral' && value.expressions.length === 0) {
    return isNegativeString(value.quasis[0].value.cooked ?? '');
  }
  return false;
}

export const noMargin = defineRule({
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid positive margins; space elements with gap or padding instead.',
    },
    messages: {
      marginClass:
        "Don't use the margin class `{{ className }}`. Use gap or padding instead; only negative margins are allowed.",
      marginStyle:
        "Don't set `{{ property }}` in inline styles. Use gap or padding instead; only negative margins are allowed.",
    },
    schema: [],
  },
  create(context) {
    function checkClasses(node: ESTree.Node) {
      const classNames = classNamesOf(node);
      if (classNames === null || !isInClassList(node)) return;
      for (const className of classNames.filter(isMarginClass)) {
        context.report({ node, messageId: 'marginClass', data: { className } });
      }
    }

    return {
      Literal: checkClasses,
      TemplateElement: checkClasses,
      JSXAttribute: inlineStyles((property, name, value) => {
        if (isMarginStyle(name) && !isNegative(value)) {
          context.report({
            node: property,
            messageId: 'marginStyle',
            data: { property: name },
          });
        }
      }),
    };
  },
});
