import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Én selvstændig HTML-fil: kører offline og kan pakkes direkte i en Windows-app.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
});
