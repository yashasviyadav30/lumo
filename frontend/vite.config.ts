/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png'],
      manifest: {
        name: 'Lumo',
        short_name: 'Lumo',
        description: 'Learn anything from YouTube, without the noise.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#070a12',
        theme_color: '#070a12',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Offline works for the app shell only (plan 1.1). Never cache API or YouTube responses (R1).
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [],
      },
    }),
  ],
  // The notepad editor loads on demand; pre-bundle it so the dev server never re-bundles mid-session.
  optimizeDeps: {
    include: [
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-highlight',
      '@tiptap/extension-list',
      '@tiptap/extension-text-style',
    ],
  },
  server: {
    // Dev only: send /api to the local backend so the app and API share one origin.
    // API_PROXY=https://focuslearn.focuslearn.workers.dev checks local screens against the live server
    proxy: { '/api': { target: process.env.API_PROXY ?? 'http://localhost:8000', changeOrigin: true } },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    testTimeout: 20000, // whole-app tests; parallel workers share one laptop
    maxWorkers: 4,
  },
})
