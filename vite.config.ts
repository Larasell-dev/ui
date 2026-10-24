import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  // Tailwind only for tests, which measure rendered sizes; the package ships source classes.
  plugins: [react(), ...(process.env.VITEST ? [tailwindcss()] : [])],
  pack: {
    entry: ['src/index.ts', 'src/icons.ts', 'src/inertia.ts'],
    dts: { tsconfig: 'tsconfig.build.json' },
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
