export interface PluginOptions {
  /**
   * Support `Iconify IntelliSense`. ! The options will change your `.vscode/settings.json`.
   * Use string to specify the path of the settings.json file.
   * @default true
   */
  iconifyIntelliSense: boolean | string

  /**
   * Setting `iconify.customCollectionJsonPaths` relative path
   * @default true
   */
  relativePath: boolean

  /**
   * @default process.cwd()
   */
  cwd: string

  /**
   * A key-value pair of icons collection names and the path of icons' folder.
   *
   * Key is the name of a collection.
   *
   * Value is the path of the folder where the icons are stored.
   */
  collections: Record<string, string>

  /**
   * Indicates the output path of the iconify meta file.
   *
   * @default './node_modules/.unplugin-iconify-generator'
   */
  output: string
}
