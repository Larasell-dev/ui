import { defineRule } from 'vite-plus/lint/plugins';

const MEASURES = new Set(['getBoundingClientRect', 'getClientRects']);
const TESTS = new Set(['test', 'it']);

type Node = {
  type: string;
  parent?: Node | null;
  key?: { type: string; name?: string };
  name?: string;
  callee?: Node;
  object?: Node;
};

/** Whether the node runs as a test or a story's play function, not while rendering. */
function inTest(node: Node) {
  for (let at = node.parent; at; at = at.parent) {
    if (
      at.type === 'Property' &&
      at.key?.type === 'Identifier' &&
      at.key.name === 'play'
    )
      return true;
    if (at.type === 'CallExpression') {
      // test(), test.skip() and test.each([...])() alike: the name at the root.
      let callee = at.callee;
      while (
        callee?.type === 'CallExpression' ||
        callee?.type === 'MemberExpression'
      )
        callee =
          callee.type === 'CallExpression' ? callee.callee : callee.object;
      if (callee?.name && TESTS.has(callee.name)) return true;
    }
  }
  return false;
}

export const noLayoutAssertions = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        "Tests and play functions check behaviour, not layout: Chromatic's screenshots cover how things look.",
    },
    messages: {
      measured:
        '`{{name}}()` measures layout, which makes tests brittle and duplicates the screenshot tests. A test or play function should only interact and assert what a user or screen reader gets: that something is visible, focused or has the right value, attribute or text. Remove the measurement and leave positions, sizes and order to Chromatic, ending the play function in the state the screenshot should show. If measuring is the behaviour under test, such as text fitting its box, disable this rule on the line and say why.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type !== 'MemberExpression' ||
          callee.property.type !== 'Identifier' ||
          !MEASURES.has(callee.property.name) ||
          !inTest(node as unknown as Node)
        )
          return;
        context.report({
          node,
          messageId: 'measured',
          data: { name: callee.property.name },
        });
      },
    };
  },
});
