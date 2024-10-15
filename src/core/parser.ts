import type { IconifyIcon, IconifyJSONIconsData, PluginOptions } from './types'
import fs from 'fs-extra'
import { basename, extname, join, resolve } from 'pathe'
import { glob } from 'tinyglobby'
import { notNullish, objectMap } from './utils'

export async function normalizeIcons(options: PluginOptions, base: string): Promise<IconifyJSONIconsData[] | false> {
  return options.collections && Object.keys(options.collections).length > 0
    ? await Promise.all(
      Object.entries(options.collections).map(async ([prefix, path]) => {
        const paths = await glob([join(path, '*.svg')], { cwd: base })
          .then(relatives => relatives.map(relative => resolve(base, relative)))

        const icons = Object.fromEntries(
          await Promise.all(
            paths.map(async (path) => {
              const name = path.split('/').at(-1)
              if (!name)
                return

              const svg = await fs.readFile(path, 'utf-8')

              const iconifyIcon = parseIcon(svg)
              if (!iconifyIcon)
                return

              return [
                basename(name, extname(name)),
                iconifyIcon,
              ] as const
            }),
          ).then(v => v.filter(notNullish)),
        )

        return {
          prefix,
          icons,
        }
      }),
    )
    : false
}

/**
 * 1. width
 * 2. height
 * 3. body
 */
export const SVG_REGEX = /<svg[^>]*?viewBox="\s*\d+\s+\d+\s+(\d+)\s+(\d+)\s*"[^>]*>(.*?)<\/svg>/s

export function parseIcon(svg: string): IconifyIcon | null {
  const match = svg.match(SVG_REGEX)

  const width = Number(match?.[1])
  const height = Number(match?.[2])

  return !!match && !Number.isNaN(width) && !Number.isNaN(height)
    ? {
        width,
        height,
        body: match[3].trim(),
      }
    : null
}

export function parseIcons(icons: Record<string, string>): IconifyJSONIconsData['icons'] {
  return objectMap(icons, (k, v) => {
    const val = parseIcon(v)

    return val ? [k, val] : undefined
  })
}
