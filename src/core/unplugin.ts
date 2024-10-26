import type { IconifyJSONIconsData } from '@iconify/types'
import type { FSWatcher } from 'chokidar'
import type { PluginOptions } from './types'
import chokidar from 'chokidar'
import fs from 'fs-extra'
import { dirname, relative, resolve } from 'pathe'
import { debounce } from 'perfect-debounce'

import { createUnplugin } from 'unplugin'
import { writeIntoVscodeSettings } from './jsonc'
import { resolveOptions } from './options'
import { normalizeIcon } from './parser'
import { mapReverse } from './utils'

export function createContext(opts: PluginOptions) {
  /** output is absolute path */
  const prefixOutputMap = new Map(
    Object.keys(opts.collections)
      .map(prefix => [
        prefix,
        resolve(opts.output, `${prefix}.json`),
      ]),
  )

  /** prefix - update debounce */
  const callbacks = new Map<string, () => Promise<void>>()
  /** icons path - prefix[] */
  const iconPrefixesMap = mapReverse(new Map(Object.entries(opts.collections)))
  function getPrefixes(icon: string) {
    let iconDir: string | undefined

    const rel = dirname(icon)
    const abs = resolve(opts.cwd, rel)

    const prefixes = [
      ...iconPrefixesMap.has(rel) ? iconPrefixesMap.get(iconDir = rel)! : [],
      ...iconPrefixesMap.has(abs) ? iconPrefixesMap.get(iconDir = abs)! : [],
    ]

    return {
      prefixes,
      iconDir,
    }
  }

  const watchCb = async (icon: string) => {
    if (!icon.endsWith('.svg'))
      return

    const { iconDir, prefixes } = getPrefixes(icon)
    if (!prefixes || !iconDir)
      return warn(`Cannot find ${prefixes}: ${icon}`)

    await Promise.all(
      prefixes.map(async (prefix) => {
        if (callbacks.has(prefix)) {
          callbacks.get(prefix)!()
        }
        else {
          const cb = debounce(async () => {
            const output = prefixOutputMap.get(prefix)
            if (!output)
              return warn(`Cannot find ${prefix}: ${output}`)

            const iconify = await normalizeIcon(opts, prefix, iconDir)
            await fs.outputFile(output, JSON.stringify(iconify))
          }, 100)
          callbacks.set(prefix, cb)
          await cb()
        }
      }),
    )
  }

  let watcher: FSWatcher

  return {
    watchStart() {
      watcher = chokidar
        .watch(Object.values(opts.collections), {
          cwd: opts.cwd,
          persistent: true,
        })
        .on('add', watchCb)
        .on('change', watchCb)
        .on('unlink', watchCb)
    },
    async watchEnd() {
      await watcher.close()
    },
    async clearOutput() {
      await fs.pathExists(opts.output)
        .then(async is => is && await fs.emptyDir(opts.output))
    },
    async createEmptyIconifyJSON() {
      for (const [prefix, output] of prefixOutputMap.entries()) {
        await fs.outputFile(output, JSON.stringify(<IconifyJSONIconsData>{ prefix, icons: {} }))
      }
    },
    async writeVscodeSettings() {
      if (opts.iconifyIntelliSense)
        await writeIntoVscodeSettings(opts, Array.from(prefixOutputMap.values()).map(p => relative(opts.cwd, p)))
    },
  }
}

export default createUnplugin<Partial<PluginOptions> | undefined>((userOptions = {}) => {
  const opts = resolveOptions(userOptions)

  const ctx = createContext(opts)

  return {
    name: 'unplugin-iconify-generator',
    async buildStart() {
      await ctx.clearOutput()

      await ctx.createEmptyIconifyJSON()

      await ctx.writeVscodeSettings()

      ctx.watchStart()
    },
    async buildEnd() {
      await ctx.watchEnd()
    },
  }
})

function warn(msg: string) {
  return console.warn(`[iconify] ${msg}`)
}
