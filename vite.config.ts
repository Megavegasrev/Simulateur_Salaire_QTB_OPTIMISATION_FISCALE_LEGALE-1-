import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Qing Tian Bois — Simulateur Salaire',
        short_name: 'QTB Salaire',
        description: 'Simulateur de salaire Qing Tian Bois — optimisation fiscale légale (Gabon)',
        theme_color: '#ffffff',
        background_color: '#eef1f6',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'fr',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
});
