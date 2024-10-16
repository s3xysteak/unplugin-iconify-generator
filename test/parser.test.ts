import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'
import { parseIcon } from '../src/core/parser'

describe('parser', () => {
  it('parseIcon', async () => {
    expect(parseIcon('noop')).toBeFalsy()

    const SVG = await readFile(fileURLToPath(new URL('./test.svg', import.meta.url)), { encoding: 'utf-8' })
    expect(parseIcon(SVG)).toMatchSnapshot()
  })
})
