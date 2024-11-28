import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { createContext } from '../src/core/unplugin'

it('ctx', async () => {
  const collections = {
    'absolute': r('./ctx-lab/icons'),
    'relative': './ctx-lab/icons',
    'rel-slash-end': './ctx-lab/icons/',
    'abs-slash-end': r('./ctx-lab/icons/'),
  }
  const ctx = createContext(resolveOptions({
    collections,
    output: './ctx-lab/output',
    cwd: r('.'),
  }))

  await ctx.clearOutput()
  expect(
    await fs.readdir(r('./ctx-lab/output'))
      .then(arr => arr.length),
  ).toBe(0)

  await ctx.createEmptyIconifyJSON()
  for (const prefix of Object.keys(collections)) {
    expect(
      await fs.readFile(r(`./ctx-lab/output/${prefix}.json`), 'utf-8'),
    ).toMatchSnapshot('empty iconify json')
  }

  await ctx.writeVscodeSettings()
  expect(
    await fs.readFile(r('./.vscode/settings.json'), 'utf-8'),
  ).toMatchSnapshot('vscode settings')

  ctx.watchStart()
  await sleep(150)

  const initialOutputSnap = (file: string) => r(`./__snapshots__/initial-output-${file}.json`)
  for (const prefix of Object.keys(collections)) {
    await expect(
      await fs.readFile(r(`./ctx-lab/output/${prefix}.json`), 'utf-8'),
    ).toMatchFileSnapshot(initialOutputSnap(prefix))
  }

  const dest = r('./ctx-lab/icons/test-1.svg')
  await fs.copyFile(r('./ctx-lab/icons/test.svg'), dest)
  await sleep(150)
  for (const prefix of Object.keys(collections)) {
    expect(
      await fs.readFile(r(`./ctx-lab/output/${prefix}.json`), 'utf-8'),
    ).toMatchSnapshot('two icons iconify json')
  }

  await fs.unlink(dest)
  await sleep(300)
  for (const prefix of Object.keys(collections)) {
    await expect(
      await fs.readFile(r(`./ctx-lab/output/${prefix}.json`), 'utf-8'),
    ).toMatchFileSnapshot(initialOutputSnap(prefix))
  }

  await ctx.watchEnd()
})

function r(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

function sleep(ms: number) {
  return new Promise<void>(res => setTimeout(() => res(), ms))
}
