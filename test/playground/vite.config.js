import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Iconify from 'unplugin-iconify-generator/vite'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Iconify({
      collections: {
        hi: './test/playground/src/icons',
      },
      cwd: fileURLToPath(new URL('../../', import.meta.url)),
      iconifyIntelliSense: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
  },
})
