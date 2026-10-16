import addonDocs from '@storybook/addon-docs';
import { definePreview } from '@storybook/react-vite';
import './tailwind.css';
import './preview.css';

export default definePreview({
  addons: [addonDocs()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
});
