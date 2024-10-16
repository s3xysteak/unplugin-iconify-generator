import type { IconifyIcon, IconifyJSONIconsData } from '@iconify/types'
import type { PluginOptions } from './types'

import { convertParsedSVG, parseSVGContent } from '@iconify/utils'
import fs from 'fs-extra'
import { join, resolve } from 'pathe'
import { filename } from 'pathe/utils'
import { glob } from 'tinyglobby'
import { notNullish } from './utils'

export async function normalizeIcon(
  options: PluginOptions,
  prefix: string,
  path: string,
): Promise<IconifyJSONIconsData> {
  const { cwd } = options

  const paths = await glob([join(path, '*.svg')], { cwd })
    .then(relatives => relatives.map(relative => resolve(cwd, relative)))

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
          filename(name),
          iconifyIcon,
        ] as const
      }),
    ).then(v => v.filter(notNullish)),
  )

  return {
    prefix,
    icons,
  }
}

export function parseIcon(svg: string): IconifyIcon | undefined {
  const val = parseSVGContent(svg)
  return val && convertParsedSVG(val)
}
