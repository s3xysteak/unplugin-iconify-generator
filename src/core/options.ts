import type { PluginOptions } from './types'
import process from 'node:process'
import { isAbsolute, normalize, resolve } from 'pathe'

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
    output: isAbsolute(result.output) ? normalize(result.output) : resolve(result.cwd, result.output),
    collections: Object.fromEntries(
      Object.entries(result.collections)
        .map(([prefix, path]) => [
          prefix,
          (isAbsolute(path)
            ? normalize(path)
            : resolve(result.cwd, path)
          ).replace(/\/$/, ''),
        ]),
    ),
  }
}
