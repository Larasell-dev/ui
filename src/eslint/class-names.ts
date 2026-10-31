import type { Context, ESTree } from 'vite-plus/lint/plugins';

export type ClassName = {
  /** As written, e.g. `hover:shadow-lg!`. */
  raw: string;
  /** The variants before the utility, e.g. `hover:dark`, or `''`. */
  variant: string;
  /** Without variants and the important modifier, e.g. `shadow-lg`. */
  utility: string;
};

/**
 * Splits a class name into its variants and utility. The last colon outside of
 * brackets and parentheses ends the variants: colons inside them belong to a
 * value, as in `text-(length:--x)` or `[&_a]:underline`.
 */
export function parseClassName(raw: string): ClassName {
  let depth = 0;
  let end = -1;
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char === '[' || char === '(') depth++;
    else if (char === ']' || char === ')') depth--;
    else if (char === ':' && depth === 0) end = i;
  }
  const utility = raw.slice(end + 1).replace(/^!|!$/g, '');
  return { raw, variant: raw.slice(0, Math.max(end, 0)), utility };
}

const splitClassNames = (value: string) => value.split(/\s+/).filter(Boolean);

/** Calls whose string arguments are class lists, e.g. `cn('flex', open && 'mt-2')`. */
const classHelpers = new Set(['cn', 'clsx', 'cva', 'cx', 'twMerge', 'twJoin']);

/** `className`, `class`, and component props like `DANGEROUS_className`. */
const isClassAttributeName = (name: string) =>
  name === 'class' || /classname$/i.test(name);

const isClassAttribute = (node: ESTree.Node) =>
  node.type === 'JSXAttribute' &&
  node.name.type === 'JSXIdentifier' &&
  isClassAttributeName(node.name.name);

const isClassHelperCall = (node: ESTree.Node) =>
  node.type === 'CallExpression' &&
  node.callee.type === 'Identifier' &&
  classHelpers.has(node.callee.name);

/**
 * Whether a string sits anywhere inside a class list: a class attribute or a
 * class helper's arguments, however deeply nested.
 */
export function isInClassList(node: ESTree.Node): boolean {
  for (
    let current: ESTree.Node | null = node.parent;
    current;
    current = current.parent
  ) {
    if (current.type === 'JSXAttribute') return isClassAttribute(current);
    if (isClassHelperCall(current)) return true;
  }
  return false;
}

/**
 * Expressions a class list passes through on its way to a class attribute or
 * helper: `className={open ? `…` : '…'}`, `open && `…``, `(`…`) as string`.
 */
const classValueWrappers = new Set([
  'ConditionalExpression',
  'LogicalExpression',
  'ParenthesizedExpression',
  'TSAsExpression',
  'TSNonNullExpression',
]);

/** Whether the node is a class list's value: a class attribute's, or a class helper's argument. */
export function isClassListValue(node: ESTree.Node): boolean {
  let current: ESTree.Node | null = node.parent;
  while (current && classValueWrappers.has(current.type)) {
    current = current.parent;
  }
  if (current?.type === 'JSXExpressionContainer') current = current.parent;
  return (
    current !== null &&
    (isClassAttribute(current) || isClassHelperCall(current))
  );
}

/** The class names in a string literal or template element, or `null` for other nodes. */
export function classNamesOf(node: ESTree.Node): string[] | null {
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return splitClassNames(node.value);
  }
  if (node.type === 'TemplateElement') {
    return splitClassNames(node.value.cooked ?? node.value.raw);
  }
  return null;
}

/**
 * Calls `check` with each property of an inline `style={{ … }}` object whose
 * name is known statically: `marginTop`, `'margin-top'`.
 */
export function inlineStyles(
  check: (property: ESTree.Node, name: string, value: ESTree.Node) => void,
) {
  return (node: ESTree.JSXAttribute) => {
    if (
      node.name.type !== 'JSXIdentifier' ||
      node.name.name !== 'style' ||
      node.value?.type !== 'JSXExpressionContainer' ||
      node.value.expression.type !== 'ObjectExpression'
    ) {
      return;
    }
    for (const property of node.value.expression.properties) {
      if (property.type !== 'Property' || property.computed) continue;
      const { key } = property;
      const name =
        key.type === 'Identifier'
          ? key.name
          : key.type === 'Literal' && typeof key.value === 'string'
            ? key.value
            : null;
      if (name !== null) check(property, name, property.value);
    }
  };
}

export type ClassNameAt = ClassName & { node: ESTree.Node };

/** Every class name in the strings and template literals under `node`. */
function collect(node: unknown, classNames: ClassNameAt[] = []): ClassNameAt[] {
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
    for (const raw of splitClassNames(text)) {
      classNames.push({ ...parseClassName(raw), node: estree });
    }
    return classNames;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key !== 'parent') collect(child, classNames);
  }
  return classNames;
}

const isClassNameVariable = (node: ESTree.Node) =>
  node.type === 'VariableDeclarator' &&
  node.id.type === 'Identifier' &&
  /className$/i.test(node.id.name);

/**
 * Calls `check` once for each list of classes that style one element: a class
 * attribute or a variable named `…className`, or a class helper call outside
 * of one. Rules that compare classes with each other, such as a shadow with
 * its background, need the whole list at once.
 */
export function classLists(
  context: Context,
  check: (classNames: ClassNameAt[]) => void,
) {
  return {
    JSXAttribute(node: ESTree.JSXAttribute) {
      if (isClassAttribute(node)) check(collect(node.value));
    },
    VariableDeclarator(node: ESTree.VariableDeclarator) {
      if (isClassNameVariable(node)) check(collect(node.init));
    },
    CallExpression(node: ESTree.CallExpression) {
      if (!isClassHelperCall(node)) return;
      for (const ancestor of context.sourceCode.getAncestors(node)) {
        const parent = ancestor as ESTree.Node;
        if (isClassAttribute(parent) || isClassNameVariable(parent)) return;
      }
      check(collect(node.arguments));
    },
  };
}
