import process from 'node:process'
import { relative, resolve } from 'pathe'
import fs from 'fs-extra'
import { createUnplugin } from 'unplugin'
import type { PluginOptions } from './types'

import { normalizeIcons } from './parser'
import { injectJsonc } from './jsonc'

export default createUnplugin<PluginOptions | undefined>((options = {}) => {
  const {
    base = process.cwd(),
    iconifyIntelliSense = true,
    output = './node_modules/.unplugin-iconify-generator',
  } = options

  return {
    name: 'unplugin-iconify-generator',
    async buildStart() {
      const list = await normalizeIcons(options, base)

      if (!list)
        return

      const outputPath: string[] = []
      for (const { prefix, icons } of list) {
        const path = resolve(base, output, `${prefix}.json`)
        await fs.outputFile(path, JSON.stringify({ prefix, icons }))
        outputPath.push(path)
      }

      // vscode setting
      if (iconifyIntelliSense) {
        const settingPath = typeof iconifyIntelliSense === 'string'
          ? iconifyIntelliSense
          : resolve(base, './.vscode/settings.json')

        await fs.ensureFile(settingPath)
        const settingText = await fs.readFile(settingPath, 'utf-8')
        const result = outputPath.map(absolute => relative(base, absolute))

        await fs.outputFile(settingPath, injectJsonc(settingText, 'iconify.customCollectionJsonPaths', result))
      }
    },
  }
})
