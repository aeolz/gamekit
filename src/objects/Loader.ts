import Aeolz from "@aeolz/core"
import * as fs from "fs"
import * as path from "path"

export class Loader {
  private static loaders: Loader[] = []

  static runLoaders() {
    this.loaders.forEach((loader) => {
      loader.load()
    })
  }

  static async loadDirectory(
    dir: string,
    allowedExtensions: string[] = []
  ): Promise<string[]> {
    return new Promise((res, rej) => {
      fs.readdir(dir, (err, files) => {
        if (err) {
          return rej(err)
        }

        const matchedFiles = files.filter((file) => {
          return allowedExtensions?.length === 0
            ? true
            : allowedExtensions.some((ext) => file?.endsWith(`.${ext}`))
        })

        const filePaths = matchedFiles.map((file) => {
          return path.join(dir, file)
        })

        res(filePaths)
      })
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
      const itemPaths = await Loader.loadDirectory(
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
