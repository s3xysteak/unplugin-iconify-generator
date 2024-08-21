import { basename, extname, join, resolve } from 'pathe'
import { glob } from 'tinyglobby'
import fs from 'fs-extra'
import type { IconifyIcon, IconifyJSONIconsData, IconifyMeta, IconsData } from './types'
import { notNullish, objectMap, toArray } from './utils'

export async function normalizeIcons<T extends IconsData = IconsData>(options: T[], base: string) {
  /** key is prefix */
  const map = new Map<string, {
    meta: IconifyMeta
    info: T
  }>()

  await Promise.all(options.map(async (option) => {
    if (!option)
      return

    const { prefix, icons } = option
    if (!prefix || !icons)
      return

    const paths = await glob(toArray(icons).map(p => join(p, '*.svg')), { cwd: base })
      .then(relatives => relatives.map(relative => resolve(base, relative)))

    const _icons = Object.fromEntries(
      await Promise.all(
        paths.map(async (path) => {
          const name = path.split('/').at(-1)
          if (!name)
            return

          const svg = await fs.readFile(path, 'utf-8')

          const val = parseIcon(svg)
          if (!val)
            return

          return [
            basename(name, extname(name)),
            val,
          ] as const
        }),
      ).then(v => v.filter(notNullish)),
    )

    map.set(prefix, {
      meta: {
        prefix,
        icons: _icons,
      },
      info: option,
    })
  }))

  return map
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
