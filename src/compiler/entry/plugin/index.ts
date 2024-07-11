import webpack, { DynamicEntryPlugin, EntryPlugin, optimize } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import EntryManager from '../manager'
import RequireChunkPlugin from './require-chunk-plugin'
import SplitPackagePlugin from './split-package-plugin'
import AppData from './app-data'
import path from 'path'
import { repalceAll } from '../utils'

export default class MPEntryPlugin {
  private name = 'MPEntryPlugin'
  private manager = new EntryManager
  private app = new AppData
  constructor(private options: {
    ignore?: Array<string | RegExp>
  } = {}) { }
  apply(compiler: webpack.Compiler) {
    const context = compiler.context

    this.app.setContext(context)
    this.app.setIgnore(this.options.ignore)
    this.manager.setContext(context)

    new DynamicEntryPlugin(context, async () => {
      return new Promise((reslove, reject) => {
        compiler.inputFileSystem!.readFile(
          this.app.path, (err, content) => {
            if (err) return reject(err)
            if (!content) return reject('获取入口信息失败')
            const result: Record<string, {}> = {}
            this.manager.loadOld(({ name, path }) => {
              result[name] = {
                import: [path]
              }
            })
            this.app.getEntries(content).forEach(({ root, path, independent }) => {
              const name = this.manager.addPage(path, root, independent)
              result[name] = {
                import: [path]
              }
            })
            return reslove(result)
          }
        )
      })
    }).apply(compiler)

    compiler.hooks.compilation.tap(this.name, (compilation) => {
      webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderChunk.tap(this.name, (source, { chunk, chunkGraph }) => {
        for (const module of chunkGraph.getChunkEntryModulesIterable(chunk)) {
          if (chunkGraph.getModuleChunks(module).length > 1) {
            const root = this.manager.getRoot(chunk.name!)
            const moduleId = chunkGraph.getModuleId(module)
            if (root) {
              return new webpack.sources.RawSource(
                repalceAll(source.source().toString(), JSON.stringify(moduleId), JSON.stringify(moduleId + '!' + root))
              )
            }
          }
        }
        return source
      })

      webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderMain.tap(this.name, (source, renderContext) => {
        if (renderContext.chunk.hasRuntime()) {
          const globalObject = compilation.outputOptions.globalObject
          return new webpack.sources.RawSource(
            source.source().toString()
              .replace(`var __webpack_modules__ = `, `var __webpack_modules__ = ${globalObject}['__webpack_modules__'] = ${globalObject}['__webpack_modules__'] || `)
              .replace(`var __webpack_module_cache__ = `, `var __webpack_module_cache__ = ${globalObject}['__webpack_module_cache__'] = ${globalObject}['__webpack_module_cache__'] || `)
          )
        }
        return source
      })
      compilation.fileDependencies.add(this.app.path)
      compilation.hooks.finishModules.tapPromise(this.name, async () => {
        this.manager.generate()
        for (const data of this.manager.data) {
          if (this.manager.needLoad(data)) {
            await new Promise<void>((resolve, reject) => {
              compilation.addEntry(
                context,
                EntryPlugin.createDependency(data.path, data.name),
                data.name,
                (err) => {
                  if (err) return reject(err)
                  resolve()
                }
              )
            })
          }
        }
      })
      compilation.hooks.beforeChunkAssets.tap(this.name, () => {
        this.manager.data.forEach(data => {
          data.getFiles().forEach(({ file, source }) => {
            compilation.emitAsset(file, source)
          })
        })
        if (this.app.source) {
          compilation.emitAsset(this.app.name, this.app.source)
        }
      })
      compilation.hooks.additionalAssets.tap(this.name, () => {
        this.manager.getNotUsed().forEach(name => {
          compilation.deleteAsset(name)
        })
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
      name: ({ name }: { name: string }) => {
        const root = this.manager.getRoot(name)
        if (root && this.app.isIndependent(root)) {
          return path.join(root, 'runtime.js')
        }
        return 'runtime.js'
      }
    }).apply(compiler)

    new SplitPackagePlugin({
      getRoot: name => this.manager.getRoot(name),
      getRoots: () => this.app.getRoots(),
      isIndependent: name => {
        const root = this.manager.getRoot(name)
        if (root) {
          return this.app.isIndependent(root)
        }
        return false
      }
    }).apply(compiler)

    new RequireChunkPlugin().apply(compiler)
  }
}