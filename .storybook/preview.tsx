import { definePreview } from '@storybook/react-vite';
import './tailwind.css';
import './preview.css';

export default definePreview({
  addons: [],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
});
