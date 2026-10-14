import { definePreview } from '@storybook/react-vite';
import '../src/styles.css';
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
