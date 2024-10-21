import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        foo: r('./src/foo'),
        bar: r('./src/bar'),
      },
    }),
  ],
})

function r(path: string) {
  return FileSystemIconLoader(
    path,
    svg => svg
      .replace(/(<svg.*?width=)"(.*?)"/, '$1"1em"')
      .replace(/(<svg.*?height=)"(.*?)"/, '$1"1em"'),
  )
}
