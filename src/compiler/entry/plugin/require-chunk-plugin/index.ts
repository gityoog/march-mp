import webpack from 'webpack'
import path from 'path'
import EnsurePosixPath from 'ensure-posix-path'

type options = {
  calcPath: (entry: webpack.Chunk, chunk: webpack.Chunk) => string
  addPath: (paths: string[]) => string
}
export default class RequireChunkPlugin {
  private name = 'RequireChunkPlugin'
  private options: options
  constructor(options: Partial<options> = {}) {
    this.options = {
      calcPath: options.calcPath || ((entry, chunk) => {
        return EnsurePosixPath(path.relative(path.dirname(entry.name!), chunk.name!))
      }),
      addPath: options.addPath || ((paths) => paths.map(path => `require("${path.replace(/\\/g, '\/')}");`).join('\n') + '\n')
    }
  }
  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(this.name, (source, { chunk, chunkGraph }) => {
        // isEntry
        if (chunkGraph.getNumberOfEntryModules(chunk) > 0) {
          const chunks = Array.from(chunk.getAllReferencedChunks()).filter(chunk_ => chunk_ !== chunk)
          if (chunks.length > 0) {
            return new webpack.sources.ConcatSource(this.options.addPath(chunks.map(c => this.options.calcPath(chunk, c))), source)
          }
        }
        return source
      })
    })
  }
}