import { defineMain } from '@storybook/react-vite/node';

export default defineMain({
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  core: {
    // Amp orb portals proxy Storybook through *.onamp.dev.
    allowedHosts: ['.onamp.dev'],
  },
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: '.storybook/vite.config.ts',
      },
    },
  },
});
