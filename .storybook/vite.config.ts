import tailwindcss from '@tailwindcss/vite';
import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), icons({ compiler: 'jsx', jsx: 'react' })],
});
