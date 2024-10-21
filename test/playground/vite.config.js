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
        foo: r('./src/foo'),
        bar: './test/playground/src/bar',
      },
      cwd: r('../../'),
    }),
  ],
  server: {
    host: '0.0.0.0',
  },
})

function r(path) {
  return fileURLToPath(new URL(path, import.meta.url))
}
