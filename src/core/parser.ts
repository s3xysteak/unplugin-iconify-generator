import { basename, extname, resolve } from 'pathe'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { IconifyMeta, IconsData } from './types'

/**
 * 1. width
 * 2. height
 * 3. body
 */
export const SVG_REGEX = /<svg[^>]*?viewBox="\s*\d+\s+\d+\s+(\d+)\s+(\d+)\s*"[^>]*>(.*?)<\/svg>/s

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
    if (!prefix || !icons || !icons.endsWith('.svg'))
      return

    const iconsMap = new Map<string, IconifyMeta['icons'][string]>()

    const paths = await fg.glob(icons, { cwd: base }).then(relatives => relatives.map(relative => resolve(base, relative)))

    await Promise.all(paths.map(async (path) => {
      const name = path.split('/').at(-1)
      if (!name)
        return

      const svg = await fs.readFile(path, 'utf-8')

      const match = svg.match(SVG_REGEX)
      if (!match)
        return

      iconsMap.set(
        basename(name, extname(name)),
        {
          width: match[1],
          height: match[2],
          body: match[3].trim(),
        },
      )
    }))

    map.set(prefix, {
      meta: {
        prefix,
        icons: Object.fromEntries(iconsMap.entries()),
      },
      info: option,
    })
  }))

  return map
}
