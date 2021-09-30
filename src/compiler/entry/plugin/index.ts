import webpack, { DynamicEntryPlugin, EntryPlugin, optimize } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import EntryManager from '../manager'
import RequireChunkPlugin from './require-chunk-plugin'
import SplitPackagePlugin from './split-package-plugin'
import AppData from './app-data'

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
        compiler.inputFileSystem.readFile(
          this.app.path, (err, content) => {
            if (err) return reject(err)
            if (!content) return reject('获取入口信息失败')
            const result: Record<string, {}> = {}
            this.app.getEntries(content).forEach(({ root, path }) => {
              const name = this.manager.addPage(path, root)
              result[name] = {
                import: [path]
              }
            })
            this.manager.load(({ name, path }) => {
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
          compilation.emitAsset('app.json', this.app.source)
        }
        this.manager.complete()
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