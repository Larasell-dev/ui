import { defineRule, type ESTree } from 'vite-plus/lint/plugins';
import {
  classNamesOf,
  inlineStyles,
  isInClassList,
  parseClassName,
} from '../../class-names.ts';

/**
 * Font sizes come only from the typescale: the type-* utilities, like
 * type-body-md, set a role's size together with its line height, weight, and
 * tracking. Tailwind's own sizes bypass it. text-left, text-mauve-500 and the
 * like aren't sizes.
 */
const namedFontSize = /^text-(?:xs|sm|base|lg|\d?xl)(?:\/.+)?$/;
/** Arbitrary sizes: text-[13px], text-[calc(…)], text-[length:…], text-(length:--x), text-[larger]. */
const arbitraryFontSize =
  /^text-(?:\[(?:[\d.]|-[\d.]|(?:calc|clamp|min|max)\(|(?:length|percentage|absolute-size|relative-size):|(?:xx?x?-)?(?:small|large)\]|medium\]|larger\]|smaller\])|\((?:length|percentage):)/;
const fontSizeProperty = /^\[font-size:/;

function isOffScaleFontSize(raw: string) {
  const { utility } = parseClassName(raw);
  return (
    namedFontSize.test(utility) ||
    arbitraryFontSize.test(utility) ||
    fontSizeProperty.test(utility)
  );
}

export const noOffScaleFontSize = defineRule({
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Forbid font sizes that aren't on the typescale of @larasell-dev/ui.",
    },
    messages: {
      fontSizeClass:
        "Don't set the font size with `{{ className }}`. Use a type-* utility like type-body-md instead.",
      fontSizeStyle:
        "Don't set `{{ property }}` in inline styles. Use a type-* utility like type-body-md instead.",
    },
    schema: [],
  },
  create(context) {
    function checkClasses(node: ESTree.Node) {
      const classNames = classNamesOf(node);
      if (classNames === null || !isInClassList(node)) return;
      for (const className of classNames.filter(isOffScaleFontSize)) {
        context.report({
          node,
          messageId: 'fontSizeClass',
          data: { className },
        });
      }
    }

    return {
      Literal: checkClasses,
      TemplateElement: checkClasses,
      JSXAttribute: inlineStyles((property, name) => {
        if (name === 'fontSize' || name === 'font-size') {
          context.report({
            node: property,
            messageId: 'fontSizeStyle',
            data: { property: name },
          });
        }
      }),
    };
  },
});
