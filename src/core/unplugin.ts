import type { IconifyJSONIconsData } from '@iconify/types'
import type { FSWatcher } from 'chokidar'
import type { PluginOptions } from './types'
import process from 'node:process'
import chokidar from 'chokidar'
import fs from 'fs-extra'
import { dirname, isAbsolute, join, resolve } from 'pathe'
import { debounce } from 'perfect-debounce'

import { createUnplugin } from 'unplugin'
import { writeIntoVscodeSettings } from './jsonc'
import { normalizeIcon } from './parser'
import { mapReverse } from './utils'

// _internals
export function resolveOptions(userOptions: Partial<PluginOptions>): PluginOptions {
  const defaultOptions: PluginOptions = {
    cwd: process.cwd(),
    iconifyIntelliSense: true,
    output: './node_modules/.unplugin-iconify-generator',
    collections: {},
  }

  const result = {
    ...defaultOptions,
    ...userOptions,
  }

  return {
    ...result,
    collections: Object.fromEntries(
      Object.entries(result.collections)
        .map(([prefix, path]) => [prefix, resolve(result.cwd, path).replace(/\/$/, '')]),
    ),
  }
}

function warn(msg: string) {
  return console.warn(`[iconify] ${msg}`)
}

export default createUnplugin<Partial<PluginOptions> | undefined>((userOptions = {}) => {
  const opts = resolveOptions(userOptions)

  /** icons path - prefix[] */
  const iconPrefixesMap = mapReverse(new Map(Object.entries(opts.collections)))
  const prefixOutputMap = new Map(
    Object.keys(opts.collections)
      .map(prefix => [
        prefix,
        resolve(opts.cwd, opts.output, `${prefix}.json`)
          /**
           * vscode fs watcher do not work when the first letter is uppercase
           * so should replace it to the lowercase
           */
          .replace(/^([a-z]):\//i, (_, $1: string) => `${$1.toLowerCase()}:/`),
      ]),
  )

  /** prefix - update debounce */
  const callbacks = new Map<string, () => Promise<void>>()

  const watchCb = async (icon: string) => {
    if (!icon.endsWith('.svg'))
      return

    const iconDir = dirname(resolve(opts.cwd, icon))
    const prefixes = iconPrefixesMap.get(iconDir)
    if (!prefixes)
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
    name: 'unplugin-iconify-generator',
    async buildStart() {
      /**
       * antfu.iconify cannot fsWatch a nonexistent file
       * so create empty iconifyJSON files first, then update vscode settings
       */
      for (const [prefix, output] of prefixOutputMap.entries()) {
        await fs.outputFile(output, JSON.stringify(<IconifyJSONIconsData>{ prefix, icons: {} }))
      }
      if (opts.iconifyIntelliSense)
        await writeIntoVscodeSettings(opts, Array.from(prefixOutputMap.values()))

      const iconPathList = Object.values(opts.collections).map(p => isAbsolute(p) ? p : join(opts.cwd, p))

      watcher = chokidar
        .watch(iconPathList, {
          cwd: opts.cwd,
          persistent: true,
        })
        .on('add', watchCb)
        .on('change', watchCb)
        .on('unlink', watchCb)
    },
    async buildEnd() {
      await watcher.close()
    },
  }
})
