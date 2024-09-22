export interface PluginOptions {
  /**
   * Support `Iconify IntelliSense`. ! The options will change your `.vscode/settings.json`.
   * Use string to specify the path of the settings.json file.
   * @default true
   */
  iconifyIntelliSense?: boolean | string

  /**
   * @default process.cwd()
   */
  base?: string

  /**
   * A key-value pair of icons collection names and the path of icons' folder.
   *
   * Key is the name of a collection.
   *
   * Value is the path of the folder where the icons are stored.
   */
  collections?: Record<string, string>

  /**
   * Indicates the output path of the iconify meta file.
   *
   * @default './node_modules/.unplugin-iconify-generator'
   */
  output?: string
}

export interface IconifyIcon {
  body: string

  // Left position of viewBox.
  // Defaults to 0.
  left?: number

  // Top position of viewBox.
  // Defaults to 0.
  top?: number

  // Width of viewBox.
  // Defaults to 16.
  width?: number

  // Height of viewBox.
  // Defaults to 16.
  height?: number
}

export interface IconifyJSONIconsData {
  // Prefix for icons in JSON file, required.
  prefix: string

  // List of icons, required.
  icons: Record<string, IconifyIcon>
}
