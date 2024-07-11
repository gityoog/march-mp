import webpack, { ChunkGraph, web } from 'webpack'
import path from 'path'

export default class SplitPackagePlugin {
  name = 'SplitPackagePlugin'
  constructor(private options: {
    getRoot(name: string): string | undefined
    getRoots(): string[]
    isIndependent(name: string): boolean
  }) { }
  packages: any[] = []
  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      compilation.hooks.afterOptimizeModules.tap(this.name, () => {
        this.packages = this.options.getRoots().map(root => {
          return {
            name: path.join(root, 'common.js'),
            chunks: (chunk: { name: string }) => this.options.getRoot(chunk.name) === root,
            minChunks: 2,
            priority: 5
          }
        })
      })
    })
    new webpack.optimize.SplitChunksPlugin({
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        common: {
          test: (module: webpack.Module, { chunkGraph }: { chunkGraph: webpack.ChunkGraph }) => {
            return chunkGraph.getModuleChunks(module).some(chunk => this.options.getRoot(chunk.name!) === undefined)
          },
          name: 'common.js',
          minChunks: 2,
          chunks: chunk => !this.options.isIndependent(chunk.name!),
          priority: 10
        },
        packages: () => {
          return this.packages
        }
      }
      // {
      //   default: false,
      //   common: {
      //     test: (module: webpack.Module, { chunkGraph }: { chunkGraph: webpack.ChunkGraph }) => {
      //       return chunkGraph.getModuleChunks(module).some(chunk => this.options.getRoot(chunk.name) === undefined)
      //     },
      //     name: 'common.js',
      //     minChunks: 2,
      //     chunks: chunk => !this.options.isIndependent(chunk.name)
      //   },
      //   packages: (module: webpack.Module, { chunkGraph }: { chunkGraph: webpack.ChunkGraph }) => {
      //     console.log('packages')
      //     return this.options.getRoots().map(root => ({
      //       test: (module: webpack.Module, { chunkGraph }: { chunkGraph: webpack.ChunkGraph }) => {
      //         return chunkGraph.getModuleChunks(module).some(chunk => this.options.getRoot(chunk.name) === root)
      //       },
      //       name: path.join(root, 'common.js'),
      //       minChunks: 2,
      //       chunks: (chunk: webpack.Chunk) => this.options.getRoot(chunk.name) === root
      //     }))
      //   }
      // }
    }).apply(compiler)
  }
}