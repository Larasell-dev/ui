import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react()],
  pack: {
    entry: {
      index: 'src/index.ts',
      icons: 'src/icons.ts',
      inertia: 'src/inertia.ts',
      eslint: 'src/eslint/index.ts',
    },
    dts: { tsconfig: 'tsconfig.build.json' },
    ignore: ['**/*.stories.tsx', '**/*.test.{ts,tsx}', '.storybook/**'],
  },
  lint: {
    jsPlugins: ['./src/eslint/index.ts'],
    rules: {
      'larasell/shadow-tokens': 'error',
      'larasell/plane-tokens': 'error',
    },
    options: {
      denyWarnings: true,
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: ['CHANGELOG.md'],
    printWidth: 80,
    tabWidth: 2,
    singleQuote: true,
    semi: true,
    singleAttributePerLine: false,
    htmlWhitespaceSensitivity: 'css',
    sortTailwindcss: {
      functions: ['cn', 'cva'],
      entryPoint: 'src/styles.css',
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'components',
          include: ['src/**/*.test.tsx'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        // Lint rules run in Node, where Oxlint's RuleTester lives.
        extends: true,
        test: { name: 'lint', include: ['src/eslint/**/*.test.ts'] },
      },
    ],
  },
});
