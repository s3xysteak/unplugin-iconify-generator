import { describe, expect, it } from 'vitest'
import { lastFolder, mapReverse } from '../src/core/utils'

describe('utils', () => {
  it('mapReverse', () => {
    expect(
      mapReverse(new Map(Object.entries({
        a: 'a',
        b: 'b',
        c: 'a',
      }))),
    ).toEqual(new Map(Object.entries({
      a: ['a', 'c'],
      b: ['b'],
    })))
  })

  it('lastFolder', () => {
    expect(
      lastFolder(''),
    ).toBe('')

    expect(
      lastFolder('/'),
    ).toBe('')

    expect(
      lastFolder('a'),
    ).toBe('a')

    expect(
      lastFolder('a/'),
    ).toBe('a')

    expect(
      lastFolder('a/b'),
    ).toBe('b')

    expect(
      lastFolder('a/b/'),
    ).toBe('b')

    expect(
      lastFolder('a/b/c.svg'),
    ).toBe('b')

    expect(
      lastFolder(''),
    ).toBe('')

    expect(
      lastFolder('\\'),
    ).toBe('')

    expect(
      lastFolder('a'),
    ).toBe('a')

    expect(
      lastFolder('a\\'),
    ).toBe('a')

    expect(
      lastFolder('a\\b'),
    ).toBe('b')

    expect(
      lastFolder('a\\b\\'),
    ).toBe('b')

    expect(
      lastFolder('a\\b\\c.svg'),
    ).toBe('b')

    expect(
      lastFolder('a\\b/'),
    ).toBe('b')

    expect(
      lastFolder('a/b\\c.svg'),
    ).toBe('b')
  })
})
