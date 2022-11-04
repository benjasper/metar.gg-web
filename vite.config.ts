import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';
import postcss from './postcss.config.js';

export default defineConfig({
  plugins: [solidPlugin(), solidSvg()],
  server: {
    port: 3000,
  },
  css: {
    postcss,
  },
  build: {
    target: 'esnext',
  },
});
