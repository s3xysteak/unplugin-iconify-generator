export interface VscodeSetting {
  'iconify.customCollectionJsonPaths': string []
  [k: string]: any
}

export interface IconifyMeta {
  prefix: string
  icons: Record<string, {
    body: string
    width?: number | string
    height?: number | string
  }>
  width?: number | string
  height?: number | string
}

export interface IconsData {
  /** i-prefix-icon */
  prefix?: string

  /**
   * glob
   * @example
   * './src/assets/svg/*.svg'
   */
  icons?: string | string[]
}

export interface IconsPluginData extends IconsData {
  /**
   * Indicates the output path of the iconify meta file.
   * @default './node_modules/.unplugin-iconify-generator'
   */
  output?: string
}

export interface IconsOptions {
  /**
   * Support `Iconify IntelliSense`. ! The options will change your `.vscode/settings.json`.
   * Use string to specify the path of the settings.json file.
   * @default false
   */
  iconifyIntelliSense?: boolean | string

  /**
   * @default process.cwd()
   */
  base?: string
}

export type PluginOptions = IconsOptions & IconsPluginData
