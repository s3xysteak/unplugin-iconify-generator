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
      prefix: 'foo',
      icons: './src/icons',

      /** enable `antfu.iconify` support */
      iconifyIntelliSense: true,
    }),
  ],
})
```

根据上述配置，假设你有图标 `bar.svg` ，将其放入 `./src/icons/`:

- 在**项目启动时**，默认在 `<root>/node_modules/.unplugin-iconify-generator` 文件夹内生成 iconify 格式的json。
- 在代码中输入 `i-foo-bar` 可以获得相应的代码联想与图标缩略图，其中`foo`为配置中的前缀，`bar`为图标名称。更多DX相关的特性请参见 `antfu.iconify` 文档。

更多详细选项与配置，请见下文 *选项* 章节。

### 规范化svg图标集

通过 `/core` 导出核心功能：

```ts
import { type IconifyMeta, normalizeIcons } from 'unplugin-iconify-generator/core'
// ...
```

详见 [源代码](/src/core)

## :wrench: 选项

在实际项目中，完整配置项可能是这样的：

```js
export default defineConfig({
  plugins: [
    Iconify([
      {
        prefix: 'foo',
        icons: './src/icons/foo',
      },
      {
        prefix: 'bar',
        icons: './src/icons/bar'
      },
      {
        iconifyIntelliSense: true
      }
    ]),
  ],
})
```

插件接受一个对象或者一个对象数组作为配置项。其中：

1. 图标集配置项会被分别用于生成 iconify 格式的json。
2. 插件配置项会通过 `Object.assign` 合并后使用。

图标集配置项与插件配置项可以混合使用，尽管这不会带来任何差异，这在极简的情况下可能有用（如 *使用* 章节的例子）。一般来说，建议将配置项区分开（如上述例子），以方便维护。

### 图标集配置项：

- `prefix`: 一个字符串，作为图标集的前缀，如 `i-foo-bar` 中，`foo`是前缀，`bar`是svg名称。
- `icons`: 一个路径字符串或路径字符串数组，指向文件夹，该文件夹下所有.svg图标会被收录进此图标集合内。
- `output`: 一个路径字符串，用来指示该图标集的 iconify 格式json文件生成在什么地方。默认为根目录下的 `node_modules/.unplugin-iconify-generator` 文件夹。

### 插件配置项：

- `iconifyIntelliSense`: 一个布尔值，用于指示是否要开启对 `antfu.iconify` 扩展的支持。注意，这会对 `.vscode/settings.json` 进行修改。
- `base`: 一个绝对路径字符串，用于指示根路径，默认为 `process.cwd()`。这会作为其他选项的基本路径使用。
