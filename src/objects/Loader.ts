import Aeolz from "@aeolz/core"
import { glob } from "glob"

export class Loader {
  private static loaders: Loader[] = []

  static runLoaders() {
    this.loaders.forEach((loader) => {
      loader.load()
    })
  }

  private called = false
  private errors = true
  private onFilesReadEndCb: (files: any[]) => void

  constructor(
    private directoryAbsolutePath: string,
    private getDefault: (defaultExport: any) => void,
    private once: boolean = false
  ) {
    Loader.loaders.push(this)
  }

  disableErrors() {
    this.errors = false
    return this
  }

  onFilesReadEnd(cb: (files: any[]) => void) {
    this.onFilesReadEndCb = cb
    return this
  }

  async load() {
    if (this.once && this.called) return
    this.called = true
    try {
      const itemPaths = await glob(
        this.directoryAbsolutePath.replace(/\\/g, "/")
      )

      const items = await Promise.all(
        itemPaths.map(async (itemPath) => (await import(itemPath))?.default)
      )
      items.forEach((item) => {
        this.getDefault(item)
      })
      this.onFilesReadEndCb?.(items)
    } catch (e) {
      if (this.errors) throw e
    }
  }
}
