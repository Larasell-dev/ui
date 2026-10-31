/*
 * Enforces the elevation guide (src/foundations/elevation.mdx) on Tailwind
 * classes: shadows come from the elevation tokens, and each one sits on its
 * plane. Only class names are checked: `className` attributes, variables
 * named `className`, and `cn()`, `cva()` and `clsx()` calls.
 */
import {
  definePlugin,
  defineRule,
  type Context,
  type ESTree,
} from 'vite-plus/lint/plugins';

/** Each elevation shadow and the plane background it belongs on. */
const planes: Record<string, string> = {
  'shadow-raised': 'bg-surface',
  'shadow-popover': 'bg-elevated',
  'shadow-elevated': 'bg-elevated',
};

const planeBackgrounds = new Set([
  'bg-canvas',
  'bg-sunken',
  'bg-surface',
  'bg-elevated',
  'bg-overlay',
]);

const classFunctions = new Set(['cn', 'cva', 'clsx', 'cx']);

type ClassName = {
  /** As written, e.g. `hover:shadow-lg!`. */
  raw: string;
  /** The variants before the utility, e.g. `hover:dark`, or `''`. */
  variant: string;
  /** Without variants and the important modifier, e.g. `shadow-lg`. */
  utility: string;
  node: ESTree.Node;
};

function parse(raw: string, node: ESTree.Node): ClassName {
  // The last colon outside of brackets and parentheses ends the variants.
  let depth = 0;
  let end = -1;
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char === '[' || char === '(') depth++;
    else if (char === ']' || char === ')') depth--;
    else if (char === ':' && depth === 0) end = i;
  }
  const utility = raw.slice(end + 1).replace(/^!|!$/g, '');
  return { raw, variant: raw.slice(0, Math.max(end, 0)), utility, node };
}

/** Every class name in the strings and template literals under `node`. */
function collect(node: unknown, classNames: ClassName[] = []): ClassName[] {
  if (Array.isArray(node)) {
    for (const child of node) collect(child, classNames);
    return classNames;
  }
  if (typeof node !== 'object' || node === null || !('type' in node)) {
    return classNames;
  }
  const estree = node as ESTree.Node;
  const text =
    estree.type === 'Literal' && typeof estree.value === 'string'
      ? estree.value
      : estree.type === 'TemplateElement'
        ? estree.value.raw
        : null;
  if (text !== null) {
    for (const raw of text.split(/\s+/).filter(Boolean)) {
      classNames.push(parse(raw, estree));
    }
    return classNames;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key !== 'parent') collect(child, classNames);
  }
  return classNames;
}

const isClassNameAttribute = (node: ESTree.Node) =>
  node.type === 'JSXAttribute' &&
  node.name.type === 'JSXIdentifier' &&
  node.name.name.endsWith('className');

const isClassNameVariable = (node: ESTree.Node) =>
  node.type === 'VariableDeclarator' &&
  node.id.type === 'Identifier' &&
  /className$/i.test(node.id.name);

/**
 * Calls `check` once for each list of classes that style one element: a
 * `className` attribute or variable, or a class function outside of one.
 */
function classLists(
  context: Context,
  check: (classNames: ClassName[]) => void,
) {
  return {
    JSXAttribute(node: ESTree.JSXAttribute) {
      if (isClassNameAttribute(node)) check(collect(node.value));
    },
    VariableDeclarator(node: ESTree.VariableDeclarator) {
      if (isClassNameVariable(node)) check(collect(node.init));
    },
    CallExpression(node: ESTree.CallExpression) {
      if (node.callee.type !== 'Identifier') return;
      if (!classFunctions.has(node.callee.name)) return;
      for (const ancestor of context.sourceCode.getAncestors(node)) {
        const parent = ancestor as ESTree.Node;
        if (isClassNameAttribute(parent) || isClassNameVariable(parent)) {
          return;
        }
      }
      check(collect(node.arguments));
    },
  };
}

const shadowTokens = defineRule({
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

const isBackgroundColor = (utility: string) =>
  /^bg-(white|black|transparent|current|inherit|[a-z]+|[a-z]+-\d+|\[.+\]|\(.+\))(\/.+)?$/.test(
    utility,
  ) &&
  !/^bg-(clip|origin|repeat|no-repeat|fixed|local|scroll|none|auto|cover|contain|center|top|bottom|left|right)\b/.test(
    utility,
  );

const isBorderWidth = (utility: string) =>
  /^border(-[xytrblse])?(-(\d+|\[.+\]|\(.+\)))?$/.test(utility);

const planeTokens = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Each elevation shadow sits on its plane, with a border, and scrims use the overlay tokens.',
    },
    messages: {
      wrongPlane: '{{shadow}} belongs on its plane: use {{background}}.',
      missingBorder:
        '{{shadow}} needs a border: a shadow alone is no visible boundary (WCAG 1.4.11).',
      missingClip:
        '{{shadow}} needs bg-clip-padding, so the semi-transparent border blends with what is behind the plane.',
      overlayShadow:
        'The overlay is a scrim and casts no shadow. Put the shadow on the elevated plane above it.',
      rawScrim:
        '`{{className}}` is not the scrim blur. Scrims use bg-overlay backdrop-blur-overlay.',
      darkOverride:
        '{{background}} already switches in dark mode. Remove `{{className}}`.',
    },
  },
  create(context) {
    return classLists(context, (classNames) => {
      // A class applies to a variant when it has no variant or the same one.
      const has = (variant: string, test: (utility: string) => boolean) =>
        classNames.some(
          (other) =>
            (other.variant === '' || other.variant === variant) &&
            test(other.utility),
        );

      for (const { raw, variant, utility, node } of classNames) {
        const background = planes[utility];
        if (background !== undefined) {
          const data = { shadow: utility, background };
          if (has(variant, (other) => other === 'bg-overlay')) {
            context.report({ node, messageId: 'overlayShadow' });
            continue;
          }
          if (!has(variant, (other) => other === background)) {
            context.report({ node, messageId: 'wrongPlane', data });
          }
          if (!has(variant, isBorderWidth)) {
            context.report({ node, messageId: 'missingBorder', data });
          }
          if (!has(variant, (other) => other === 'bg-clip-padding')) {
            context.report({ node, messageId: 'missingClip', data });
          }
        }

        if (
          utility.startsWith('backdrop-blur') &&
          utility !== 'backdrop-blur-overlay' &&
          utility !== 'backdrop-blur-none'
        ) {
          context.report({
            node,
            messageId: 'rawScrim',
            data: { className: raw },
          });
        }

        if (variant.split(':').includes('dark') && isBackgroundColor(utility)) {
          const plane = classNames.find(
            (other) =>
              other.variant === '' && planeBackgrounds.has(other.utility),
          );
          if (plane) {
            context.report({
              node,
              messageId: 'darkOverride',
              data: { background: plane.utility, className: raw },
            });
          }
        }
      }
    });
  },
});

export default definePlugin({
  meta: { name: 'elevation' },
  rules: { 'shadow-tokens': shadowTokens, 'plane-tokens': planeTokens },
});
