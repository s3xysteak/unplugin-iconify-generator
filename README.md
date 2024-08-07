# unplugin-iconify-generator

English | [简体中文](./README-zh.md)

Generate `iconify` format json files based on svg icons.

## Features

1. Based on the Vscode extension `antfu.iconify`, provide DX support for customized icons collection.
2. Normalize svg icons to `iconify` format json file.

## Usage

```sh
pnpm i -D unplugin-iconify-generator
```

### Provide DX support for customized icons collection

First please install the Vscode extension `antfu.iconify`.

Currently it supports `vite` / `rollup` / `esbuild` / `webpack`. Taking Vite as an example:

```js
import { defineConfig } from 'vite'

import Iconify from 'unplugin-iconify-generator/vite'

export default defineConfig({
  plugins: [
    Iconify({
      prefix: 'hello',
      icons: './src/icons/*.svg',

      /** enable `antfu.iconify` support */
      iconifyIntelliSense: true,
    }),
  ],
})
```

According to the config above, assume that you have a icon `world.svg`, put it into `./src/icons`:

- While **boot of project**, generate iconify format json in `<root>/icons-meta` as default.
- Type in `i-hello-world` could have intelliSense and mini icon, which `hello` is the prefix, `world` is the name of icon. More features about DX please refer to the document of `antfu.iconify`.

More details and options, please refer to the *Options* chapter below.

### Normalize svg

Export core function by `/core`:

```ts
import { type IconifyMeta, normalizeIcons } from 'unplugin-iconify-generator/core'
// ...
```

For more details plz refer to [source](/src/core)

## Options

In real project, the config could be like that:

```js
export default defineConfig({
  plugins: [
    Iconify([
      {
        prefix: 'foo',
        icons: './src/icons/foo/*.svg',
      },
      {
        prefix: 'bar',
        icons: './src/icons/bar/*.svg'
      },
      {
        iconifyIntelliSense: true
      }
    ]),
  ],
})
```

The plugin accept a object or a object array as the config, which is:

1. Icons collection config will be used to generate iconify format json files.
2. Plugin options will work after merged by `Object.assign`.

Icon set configuration options and plugin configuration options can be used together, although this will not make any difference. This can be useful in minimalist scenarios. Generally, it is recommended to distinguish between the configuration options (as in the example above) for easier maintenance.

### Icons collection configuration

- `prefix`: A string which is the prefix of icons collection. For example in `i-my-icon`, `my` is the prefix and `icon` is the name of icon.
- `icons`: A string about [glob](https://github.com/mrmlnc/fast-glob) path, used to indicate which icons will be collected into the collection. By the way it is meaningless to use file types except `.svg`.
- `output`: A string about path, indicated where the iconify format json will be generated. In default is the `icons-meta` folder at the root.

### Plugin configuration

- `iconifyIntelliSense`: A boolean, indicated whether to enable the support for `antfu.iconify`. Notice that it will edit `.vscode/settings.json`.
- `base`: A string about absolute path, to indicate the root path. In default it is `process.cwd()`.
