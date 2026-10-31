import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react()],
  pack: {
    entry: ['src/index.ts', 'src/icons.ts', 'src/inertia.ts'],
    dts: { tsconfig: 'tsconfig.build.json' },
    ignore: ['**/*.stories.tsx', '**/*.test.tsx', '.storybook/**'],
  },
  lint: {
    jsPlugins: ['./lint/elevation.ts'],
    rules: {
      'elevation/shadow-tokens': 'error',
      'elevation/plane-tokens': 'error',
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
          include: ['src/**/*.test.{ts,tsx}'],
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
        test: { name: 'lint', include: ['lint/**/*.test.ts'] },
      },
    ],
  },
});
