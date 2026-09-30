/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Constance – développement',
        short_name: 'Constance',
        description: 'Suivi du développement de Constance',
        theme_color: '#5b5bd6',
        background_color: '#faf9f7',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: { maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, globPatterns: ['**/*.{js,css,html,svg,json}'] },
    }),
  ],
  test: { include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'] },
});
