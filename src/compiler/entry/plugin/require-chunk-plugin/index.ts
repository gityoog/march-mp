import webpack from 'webpack'
import Path from 'path'
import EnsurePosixPath from 'ensure-posix-path'

type options = {
  runtime: string
  calcPath: (entry: webpack.Chunk, chunk: webpack.Chunk) => string
  addPath: (paths: string[]) => string
}
export default class RequireChunkPlugin {
  private name = 'RequireChunkPlugin'
  private options: options
  constructor(options: Partial<options> = {}) {
    this.options = {
      runtime: options.runtime || 'runtime.js',
      calcPath: options.calcPath || ((entry, chunk) => {
        return EnsurePosixPath(Path.relative(Path.dirname(entry.name), chunk.name))
      }),
      addPath: options.addPath || ((paths) => paths.map(path => `require("${path.replace(/\\/g, '\/')}");`).join('\n') + '\n')
    }
  }
  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(this.name, (source, { chunk, chunkGraph }) => {
        const isEntry = (chunk_: webpack.Chunk) => {
          return chunkGraph.getNumberOfEntryModules(chunk_) > 0
        }
        if (isEntry(chunk)) {
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