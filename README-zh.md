# :tada: unplugin-iconify-generator

[English](./README.md) | 简体中文

基于Vscode扩展 `antfu.iconify` 为自定义图标库提供DX支持。

## :memo: 使用

安装：

```sh
pnpm i -D unplugin-iconify-generator
```

### 为自定义图标库提供DX支持

请先安装Vscode插件 `antfu.iconify`。

得益于 `unplugin`，`unplugin-iconify-generator` 提供了对[多个打包工具](https://unplugin.unjs.io/guide/)的同步支持，以 Vite 为例：

```js
import Iconify from 'unplugin-iconify-generator/vite'

import { defineConfig } from 'vite'

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

根据上述配置，假设你有图标 `bar.svg` ，将其放入 `./src/assets/icons/`:

- 此插件默认在 `<root>/node_modules/.unplugin-iconify-generator` 文件夹内生成 iconify 格式的json。
- 此插件会修改 `.vscode/settings.json` 使 `antfu.iconify` 获取自定义图标。这个过程通过 `jsonc-parser` 实现，应当能够保留注释并保持配置文件的格式。
- 你可以在代码中输入 `i-foo-bar` 以获得相应的代码联想与图标缩略图，其中`foo`为配置中的前缀，`bar`为图标文件名称。更多DX相关的特性请参见 [antfu.iconify](https://github.com/antfu/vscode-iconify) 文档。

更多详细选项与配置，请见下文 *选项* 章节。

### 规范化svg图标集

详见 [源代码](/src/core)

```ts
import { type IconifyIcon, parseIcon } from 'unplugin-iconify-generator'
// ...
```

## :wrench: 选项

- `iconifyIntelliSense`: 一个布尔值，用于指示是否要开启对 `antfu.iconify` 扩展的支持。注意，开启后会对 `.vscode/settings.json` 进行修改。默认值: `true`。
- `cwd`: 一个绝对路径字符串，用于指示根路径，这会作为其他选项的基本路径使用。默认值: `process.cwd()`。
- `output`: 一个路径字符串，用于存放生成的元信息。默认值: `'./node_modules/.unplugin-iconify-generator'`。
- `collections`: 一个必填的对象，键名为一个表示图标集前缀的字符串，键值为指向一个文件夹的路径字符串，该文件夹下所有`.svg`文件将被认为是属于该图标集的图标。

```js
{
  collections: {
    foo: './src/assets/icons'
  }
}
```

假设你有图标`'./src/assets/icons/bar.svg'`，你可以像这样在项目中获得提示：
`i-foo-bar`
