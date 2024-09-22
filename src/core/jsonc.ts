import * as jsonc from 'jsonc-parser'

export function injectJsonc(jsonText: string, key: string, newValue: any, flat = true) {
  const { insertSpaces, tabSize } = detectIndentation(jsonText)

  const edits = jsonc.modify(
    jsonText,
    flat ? [key] : key.split('.'),
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
