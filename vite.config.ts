import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/Buttonify/",
  plugins: [
    tailwindcss(),
    svelte()
  ],
	optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    fs: {
      allow: ['../..']
    }
	},
  resolve: {
    alias: [
      { find: '@/*', replacement: resolve(__dirname, 'src') },
      { find: '@assets', replacement: resolve(__dirname, './src/assets') },
      { find: '@styles', replacement: resolve(__dirname, './src/styles') },
    ]
  },
});