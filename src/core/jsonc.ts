import type { PluginOptions } from './types'
import fs from 'fs-extra'
import * as jsonc from 'jsonc-parser'
import { resolve } from 'pathe'
import { toArray } from './utils'

/** write customCollectionJsonPaths into vscode settings */
export async function writeIntoVscodeSettings(opts: PluginOptions, result: any) {
  const settingPath = typeof opts.iconifyIntelliSense === 'string'
    ? opts.iconifyIntelliSense
    : resolve(opts.cwd, './.vscode/settings.json')

  await fs.ensureFile(settingPath)
  const settingText = await fs.readFile(settingPath, 'utf-8')

  await fs.outputFile(settingPath, injectJsonc(settingText, 'iconify.customCollectionJsonPaths', result))
}

export function injectJsonc(jsonText: string, key: string | jsonc.JSONPath, newValue: any) {
  const { insertSpaces, tabSize } = detectIndentation(jsonText)

  const edits = jsonc.modify(
    jsonText,
    toArray(key),
    newValue,
    { formattingOptions: { insertSpaces, tabSize } },
  )

  const updatedJsonText = jsonc.applyEdits(jsonText, edits)

  return updatedJsonText
}

export function detectIndentation(jsonText: string) {
  const lines = jsonText.split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^(\s+)\S/)
    if (match) {
      const indent = match[1]
      return {
        insertSpaces: indent.includes(' '),
        tabSize: indent.includes(' ') ? indent.length : 2,
      }
    }
  }
  return {
    insertSpaces: true,
    tabSize: 2,
  }
}
