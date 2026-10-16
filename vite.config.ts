import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react()],
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    ignore: ['**/*.stories.tsx', '**/*.test.tsx', '.storybook/**'],
  },
  lint: {
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
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
