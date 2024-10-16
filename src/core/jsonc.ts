import * as jsonc from 'jsonc-parser'
import { toArray } from './utils'

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
