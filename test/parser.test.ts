import { describe, expect, it } from 'vitest'
import { parseIcon, parseIcons } from '../src/core/parser'

describe.concurrent('parser', () => {
  // body
  const SVG_BODY = `<path d="M117.444 167.888C117.444 140.273 139.83 117.888 167.444 117.888V117.888C195.058 117.888 217.444 140.273 217.444 167.888V167.888C217.444 195.502 195.058 217.888 167.444 217.888V217.888C139.83 217.888 117.444 195.502 117.444 167.888V167.888Z" fill="#858585"/>
  <path d="M117.444 53C117.444 25.3858 139.83 3 167.444 3V3C195.058 3 217.444 25.3858 217.444 53V98C217.444 100.761 215.205 103 212.444 103H122.444C119.683 103 117.444 100.761 117.444 98V53Z" fill="#CCCCCC"/>
  <path d="M102 167.888C102 195.502 79.6142 217.888 52 217.888V217.888C24.3858 217.888 2 195.502 2 167.888L2.00001 122.888C2.00001 120.126 4.23859 117.888 7.00001 117.888L97 117.888C99.7614 117.888 102 120.126 102 122.888L102 167.888Z" fill="#4D4D4D"/>`

  // whole svg
  const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220" fill="none">
  ${SVG_BODY}
</svg>
`

  it('parseIcon', () => {
    expect(parseIcon('noop')).toBeNull()

    expect(parseIcon(SVG)).toEqual({
      width: 220,
      height: 220,
      body: SVG_BODY,
    })
  })

  it('parseIcons', () => {
    expect(
      parseIcons({
        uno: SVG,
      }),
    ).toEqual(
      {
        uno: {
          width: 220,
          height: 220,
          body: SVG_BODY,
        },
      },
    )
  })
})
