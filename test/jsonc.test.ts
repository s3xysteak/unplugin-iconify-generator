import { describe, expect, it } from 'vitest'
import { detectIndentation, injectJsonc } from '../src/core/jsonc'

describe('jsonc', () => {
  it('detectIndentation', () => {
    expect(
      detectIndentation(`{
  "a": 1
}`),
    ).toEqual({ insertSpaces: true, tabSize: 2 })

    expect(
      detectIndentation(`{
    "a": 1
}`),
    ).toEqual({ insertSpaces: true, tabSize: 4 })
  })

  it('injectJsonc', () => {
    expect(injectJsonc(`{
  // hello
  "one": 1,
  // world
  "two": {
    three: 3 // UwU
  },
  "four": 4
}`, 'four', [4, 5, 6])).toMatchSnapshot()

    expect(injectJsonc(`{
  // hello
  "one": 1, // UwU
}`, 'two', 2)).toMatchSnapshot()

    expect(injectJsonc(`{
  // hello
  "one": 1, // UwU
  "two": [0, 0]
}`, 'two', [2, 3, 4])).toMatchSnapshot()

    expect(injectJsonc(`{
  // hello
  "one": 1,
}`, 'two.three', [2, 3])).toMatchSnapshot()
  })
})
