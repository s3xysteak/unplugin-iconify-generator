import type { FSWatcher } from 'chokidar'
import type { PluginOptions } from './types'
import process from 'node:process'
import chokidar from 'chokidar'
import fs from 'fs-extra'
import { isAbsolute, join, relative, resolve } from 'pathe'
import { debounce } from 'perfect-debounce'
import { createUnplugin } from 'unplugin'

import { injectJsonc } from './jsonc'
import { normalizeIcons } from './parser'

export default createUnplugin<PluginOptions | undefined>((options = {}) => {
  const {
    base = process.cwd(),
    iconifyIntelliSense = true,
    output = './node_modules/.unplugin-iconify-generator',
    collections,
  } = options

  const run = debounce(async () => {
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
  }, 100)

  const watchCb = async (path: string) => {
    if (path.endsWith('.svg'))
      await run()
  }

  let watcher: FSWatcher

  return {
    name: 'unplugin-iconify-generator',
    buildStart() {
      const pathList = Object.values(collections ?? {}).map(p => isAbsolute(p) ? p : join(base, p))

      watcher = chokidar
        .watch(pathList, {
          cwd: base,
          persistent: true,
        })
        .on('add', watchCb)
        .on('change', watchCb)
        .on('unlink', watchCb)
    },
    buildEnd() {
      return watcher.close()
    },
  }
})
