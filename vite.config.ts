import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: "/Buttonify/",
  plugins: [
    tailwindcss(),
    svelte(),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
      // Generates 'manifest.webmanifest' file on build
      manifest: {
        name: 'Buttonify',
        short_name: 'Buttonify',
        start_url: '/Buttonify/',
        display: 'standalone',
        description: 'A simple FFmpeg-based web app to convert user videos to old school 88x31px buttons.',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'icon-192.webp',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.webp',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        "screenshots": [
          // Mobile
          {
            "src": "screenshots/narrow1.png",
            "sizes": "1080x2292",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Buttonify!"
          },
          // Desktop
          {
            "src": "screenshots/wide1.png",
            "sizes": "1920x1080",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Buttonify!"
          },
        ],
      }
    }),
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