import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { normalizeIcon, parseIcon } from '../src/core/parser'

describe('parser', () => {
  it('parseIcon', async () => {
    expect(parseIcon('noop')).toBeFalsy()

    const SVG = await readFile(fileURLToPath(new URL('./test.svg', import.meta.url)), { encoding: 'utf-8' })
    expect(parseIcon(SVG)).toMatchSnapshot()
  })

  it('normalizeIcon', async () => {
    expect(
      await normalizeIcon(
        resolveOptions({ cwd: fileURLToPath(new URL('.', import.meta.url)) }),
        'foo',
        '.',
      ),
    ).toMatchSnapshot()
  })
})
