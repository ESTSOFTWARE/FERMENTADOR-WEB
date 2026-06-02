import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType:  'autoUpdate',
      includeAssets: ['assets/icon-192.png', 'assets/icon-512.png', 'assets/apple-touch-icon.png'],
      manifest: {
        name:             'Nich-Ká',
        short_name:       'Nich-Ká',
        description:      'Plataforma educativa de monitoreo de fermentación de café con sensores IoT y machine learning.',
        start_url:        '/',
        display:          'standalone',
        background_color: '#0A0A0B',
        theme_color:      '#22C55E',
        lang:             'es',
        icons: [
          { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      devOptions: {
        enabled: true,
        type:    'module',
      },
      workbox: {
        globPatterns:      ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler:    'CacheFirst',
            options: {
              cacheName:  'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler:    'CacheFirst',
            options: {
              cacheName:  'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
