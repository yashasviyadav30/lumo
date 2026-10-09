/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Thrywe',
        short_name: 'Thrywe',
        description:
          'Learn anything from YouTube, without the noise: an AI summary and mind map for any video, your own notes beside the player, and study groups.',
        id: '/',
        start_url: '/',
        scope: '/',
        lang: 'en',
        display: 'standalone',
        categories: ['education', 'productivity'],
        background_color: '#4b3fbf', // the phone's own launch screen: violet with the icon
        theme_color: '#4b3fbf',
        // What the install sheet shows on Android and desktop Chrome, like a store listing.
        screenshots: [
          { src: '/screenshots/home.webp', sizes: '618x1372', type: 'image/webp', form_factor: 'narrow', label: 'Home: videos for your goal' },
          { src: '/screenshots/summary.webp', sizes: '618x1372', type: 'image/webp', form_factor: 'narrow', label: 'An AI summary of any video' },
          { src: '/screenshots/mind-map.webp', sizes: '618x1372', type: 'image/webp', form_factor: 'narrow', label: 'The video as a mind map' },
          { src: '/screenshots/laptop.webp', sizes: '1920x1200', type: 'image/webp', form_factor: 'wide', label: 'Study on a laptop' },
        ],
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
    // API_PROXY=https://thrywe.pages.dev checks local screens against the live server
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
