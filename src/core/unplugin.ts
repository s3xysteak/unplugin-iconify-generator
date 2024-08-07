import process from 'node:process'
import { relative, resolve } from 'pathe'
import fs from 'fs-extra'
import { createUnplugin } from 'unplugin'
import type { PluginOptions, VscodeSetting } from './types'

import { normalizeIcons } from './parser'

export default createUnplugin<PluginOptions | PluginOptions[] | undefined>((_options = {}) => {
  const options = Array.isArray(_options) ? _options : [_options]

  const opt: PluginOptions = Object.assign(...options as [any])
  const {
    base = process.cwd(),
    iconifyIntelliSense = false,
  } = opt

  return {
    name: 'unplugin-iconify-generator',
    async buildStart() {
      const map = await normalizeIcons(options, base)

      if (map.size === 0)
        return

      const outputPath: string[] = []
      for (const [k, v] of map.entries()) {
        const path = resolve(base, v.info.output ?? './icons-meta', `${k}.json`)
        await fs.outputFile(path, JSON.stringify(v.meta))
        outputPath.push(path)
      }

      // vscode setting
      if (iconifyIntelliSense) {
        const settingPath = typeof iconifyIntelliSense === 'string'
          ? iconifyIntelliSense
          : resolve(base, './.vscode/settings.json')

        await fs.ensureFile(settingPath)
        const setting: VscodeSetting = await fs.readFile(settingPath, 'utf-8')
          .then(val => val === '' ? {} : JSON.parse(val))

        setting['iconify.customCollectionJsonPaths'] = outputPath.map(absolute => relative(base, absolute))
        await fs.outputFile(settingPath, `${JSON.stringify(setting, null, 2)}\n`)
      }
    },
  }
})
