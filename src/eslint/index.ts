/*
 * Lint rules for apps and extensions built with @larasell-dev/ui, as an
 * Oxlint JS plugin (ESLint's plugin API). Extend `recommended` in
 * oxlint.config.ts, or in Vite+'s `lint`, to enable all of them.
 */
import type { OxlintConfig } from 'vite-plus/lint';
import { definePlugin } from 'vite-plus/lint/plugins';
import { noMargin } from './rules/no-margin/no-margin.ts';
import { noOffScaleFontSize } from './rules/no-off-scale-font-size/no-off-scale-font-size.ts';
import { planeTokens } from './rules/plane-tokens/plane-tokens.ts';
import { preferCn } from './rules/prefer-cn/prefer-cn.ts';
import { shadowTokens } from './rules/shadow-tokens/shadow-tokens.ts';

export default definePlugin({
  meta: { name: 'larasell' },
  rules: {
    'no-margin': noMargin,
    'no-off-scale-font-size': noOffScaleFontSize,
    'prefer-cn': preferCn,
    'shadow-tokens': shadowTokens,
    'plane-tokens': planeTokens,
  },
});

/**
 * The plugin with every rule as an error. Package configs can only be
 * extended from oxlint.config.ts, not .oxlintrc.json:
 *
 *   import { recommended } from '@larasell-dev/ui/eslint';
 *   export default defineConfig({ extends: [recommended] });
 */
export const recommended = {
  jsPlugins: ['@larasell-dev/ui/eslint'],
  rules: {
    'larasell/no-margin': 'error',
    'larasell/no-off-scale-font-size': 'error',
    'larasell/prefer-cn': 'error',
    'larasell/shadow-tokens': 'error',
    'larasell/plane-tokens': 'error',
  },
} satisfies OxlintConfig;
