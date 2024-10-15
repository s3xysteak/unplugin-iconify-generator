# :tada: unplugin-iconify-generator

English | [简体中文](./README-zh.md)

Provide DX support for custom icon collections based on the Vscode extension `antfu.iconify`.

## :memo: Usage

To install:

```sh
pnpm i -D unplugin-iconify-generator
```

### Provide DX support for customized icons collection

First please install the Vscode extension `antfu.iconify`.

Thanks to `unplugin`, `unplugin-iconify-generator` offers synchronized support for [multiple bundlers](https://unplugin.unjs.io/guide/). For example, with Vite:

```js
import { defineConfig } from 'vite'

import Iconify from 'unplugin-iconify-generator/vite'

export default defineConfig({
  plugins: [
    Iconify({
      collections: {
        foo: './src/assets/icons'
      }
    }),
  ],
})
```

According to the config above, assume that you have a icon `bar.svg`, put it into `./src/assets/icons/`:

- By default, iconify-formatted JSON is generated in the `<root>/node_modules/.unplugin-iconify-generator` folder.
- Modify `.vscode/settings.json` to allow `antfu.iconify` to fetch custom icons. This process is implemented using `jsonc-parser`, which could preserve comments and maintain the configuration file format.
- When typing `i-foo-bar` in the code, you can get corresponding code suggestions and icon thumbnails, where `foo` is the prefix from the configuration, and `bar` is the filename of the icon. For more DX-related features, refer to the [antfu.iconify](https://github.com/antfu/vscode-iconify) documentation.

More details and options, please refer to the *Options* chapter below.

### Normalize svg icons collection

Export core function by `/core`:

```ts
import { type IconifyIcon, parseIcon } from 'unplugin-iconify-generator/core'
// ...
```

For more details plz refer to [source code](/src/core).

## :wrench: Options

- `iconifyIntelliSense`: A boolean value indicating whether to enable support for the `antfu.iconify` extension. Note that enabling this will modify `.vscode/settings.json`. Default: `true`.
- `base`: An absolute path string specifying the root path, which will be used as the base path for other options. Default: `process.cwd()`.
- `output`: A path string indicating where the generated metadata will be stored. Default: `'./node_modules/.unplugin-iconify-generator'`.
- `collections`: A required object where the key is a string representing the icon set prefix, and the value is a path string pointing to a folder. All `.svg` files within that folder will be considered as icons belonging to the specified icon set.

```js
{
  collections: {
    foo: './src/assets/icons'
  }
}
```

Assume you have a icon `'./src/assets/icons/bar.svg'`, you can use it like:
`i-foo-bar`
