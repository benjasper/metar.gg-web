import { defineConfig } from 'vite';
import solid from "solid-start/vite";
import solidSvg from 'vite-plugin-solid-svg';

export default defineConfig({
  plugins: [solid(), solidSvg()],
  server: {
    port: 3000,
  },
});
