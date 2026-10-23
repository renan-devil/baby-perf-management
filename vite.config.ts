/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 4000 },
  plugins: [
    react(),
    VitePWA({
      // The site is password-protected on the server, so pages must not be served from an
      // offline cache. selfDestroying removes the service worker installed by earlier versions.
      selfDestroying: true,
      registerType: 'autoUpdate',
      includeAssets: ['icon-64.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Constance',
        short_name: 'Constance',
        description: 'Développement, administratif, école et photos',
        theme_color: '#5b5bd6',
        background_color: '#faf9f7',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: { maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, globPatterns: ['**/*.{js,css,html,svg,json}'] },
    }),
  ],
  test: { include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'] },
});
