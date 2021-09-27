import webpack, { DynamicEntryPlugin, EntryPlugin, optimize } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'

import fs from 'fs'
import path from 'path'
import EntryManager from '../manager'
import RequireChunkPlugin from './require-chunk-plugin'
import SplitPackagePlugin from './split-package-plugin'

const jsonName = 'app.json'

export default class MPEntryPlugin {
  private name = 'MPEntryPlugin'
  private manager = new EntryManager

  apply(compiler: webpack.Compiler) {
    const context = compiler.context
    const appjson = path.resolve(compiler.context, jsonName)
    const appjsonData = JSON.parse(fs.readFileSync(appjson, 'utf8')) as {
      pages?: string[]
      subpackages?: {
        root: string
        pages: string[]
      }[]
    }

    this.manager.setContext(compiler.context)

    new DynamicEntryPlugin(compiler.context, async () => {
      const result: Record<string, {}> = {}
      const entries: {
        root?: string
        path: string
      }[] = []

      appjsonData.pages?.forEach(item => {
        entries.push({
          path: path.resolve(context, item + '.tsx')
        })
      })
      appjsonData.subpackages?.forEach(({ root, pages }) => {
        pages.forEach(item => {
          entries.push({
            root,
            path: path.resolve(context, root, item + '.tsx')
          })
        })
      })

      entries.forEach(({ root, path }) => {
        const name = this.manager.addPage(path, root)
        result[name] = {
          import: [path]
        }
      })
      return result
    }).apply(compiler)

    compiler.hooks.compilation.tap(this.name, (compilation) => {
      compilation.fileDependencies.add(appjson)
      compilation.hooks.finishModules.tapPromise(this.name, async () => {
        this.manager.generate()
        for (const data of this.manager.data) {
          await new Promise<void>((resolve, reject) => {
            if (!data.isPage) {
              compilation.addEntry(
                context,
                EntryPlugin.createDependency(data.path, data.name),
                data.name,
                (err) => {
                  if (err) return reject(err)
                  resolve()
                }
              )
            } else {
              resolve()
            }
          })
        }
      })
      compilation.hooks.beforeChunkAssets.tap(this.name, () => {
        this.manager.data.forEach(data => {
          data.getFiles().forEach(({ file, source }) => {
            compilation.emitAsset(file, source)
          })
        })
        compilation.emitAsset('app.json', new webpack.sources.RawSource(JSON.stringify(appjsonData, null, 2)))
      })
    })

    // 复制根目录文件
    new CopyWebpackPlugin({
      patterns: [{
        from: './*',
        globOptions: {
          ignore: ['**/*.scss', '**/app.ts', '**/*.tsx', '**/*.js', '**/tsconfig.json', '**/Thumbs.db', '**/app.json']
        }
      }]
    }).apply(compiler)

    new optimize.RuntimeChunkPlugin({
      name: 'runtime.js'
    }).apply(compiler)

    new SplitPackagePlugin({
      getRoot: name => this.manager.getRoot(name)
    }).apply(compiler)

    new RequireChunkPlugin().apply(compiler)
  }
}