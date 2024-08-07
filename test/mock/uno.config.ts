import { defineConfig, presetIcons, presetUno } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        hi: FileSystemIconLoader('./src/icons'),
      },
    }),
  ],
})
