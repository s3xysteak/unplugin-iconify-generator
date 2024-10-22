import { describe, expect, it } from 'vitest'
import { lastFolder, lowercaseDriver, mapReverse } from '../src/core/utils'

describe('utils', () => {
  it('lowercaseDriver', () => {
    expect(lowercaseDriver('abc')).toBe('abc')
    expect(lowercaseDriver('/abc')).toBe('/abc')
    expect(lowercaseDriver('e:/a')).toBe('e:/a')
    expect(lowercaseDriver('E:/a')).toBe('e:/a')
  })

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
