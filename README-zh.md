# :tada: unplugin-iconify-generator

[English](./README.md) | 简体中文

基于svg图标生成 `iconify` 格式的json文件。

## :sparkles: 特性

1. 基于Vscode扩展 `antfu.iconify` 为自定义图标库提供DX支持。
2. 将svg图标规范化为 `iconify` 图标集格式的json文件。

## :memo: 使用

```sh
pnpm i -D unplugin-iconify-generator
```

### 为自定义图标库提供DX支持

请先安装Vscode插件 `antfu.iconify`。

目前支持 `vite` / `rollup` / `esbuild` / `webpack`，以 Vite 为例：

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

根据上述配置，假设你有图标 `bar.svg` ，将其放入 `./src/assets/icons/`:

- 在**项目启动时**，默认在 `<root>/node_modules/.unplugin-iconify-generator` 文件夹内生成 iconify 格式的json。
- 在代码中输入 `i-foo-bar` 可以获得相应的代码联想与图标缩略图，其中`foo`为配置中的前缀，`bar`为图标名称。更多DX相关的特性请参见 `antfu.iconify` 文档。

更多详细选项与配置，请见下文 *选项* 章节。

### 规范化svg图标集

通过 `/core` 导出核心功能：

```ts
import { type IconifyIcon, parseIcon } from 'unplugin-iconify-generator/core'
// ...
```

详见 [源代码](/src/core)

## :wrench: 选项

- `iconifyIntelliSense`: 一个布尔值，用于指示是否要开启对 `antfu.iconify` 扩展的支持。注意，这会对 `.vscode/settings.json` 进行修改。
- `base`: 一个绝对路径字符串，用于指示根路径，默认为 `process.cwd()`。这会作为其他选项的基本路径使用。
- `collections`: 一个对象，键名为一个表示图标集前缀的字符串，键值为指向一个文件夹的路径字符串，该文件夹下所有`.svg`文件将被认为是属于该图标集的图标。

```js
{
  collections: {
    foo: './src/assets/icons'
  }
}
```

假设你有图标`'./src/assets/icons/bar.svg'`，你可以像这样在项目中获得提示：
`i-foo-bar`

- `output`: 一个路径字符串，用于存放生成的元信息。默认为`'./node_modules/.unplugin-iconify-generator'`。
