import webpack from 'webpack'
import path from 'path'

export default class SplitPackagePlugin {
  name = 'SplitPackagePlugin'
  constructor(private options: {
    getRoot(name: string): string | undefined
  }) { }
  apply(compiler: webpack.Compiler) {
    new webpack.optimize.SplitChunksPlugin({
      minSize: 0,
      minChunks: 999,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      cacheGroups: {
        common: {
          test: (module: webpack.Module, { chunkGraph }: { chunkGraph: webpack.ChunkGraph }) => {
            return chunkGraph.getModuleChunks(module).some(chunk => this.options.getRoot(chunk.name) === undefined)
          },
          name: 'common.js',
          minChunks: 2,
          chunks: 'all'
        },
        // packages: {
        //   test: (module: webpack.Module, { chunkGraph }: { chunkGraph: webpack.ChunkGraph }) => {
        //     return chunkGraph.getModuleChunks(module).every(chunk => this.options.getRoot(chunk.name) !== undefined)
        //   },
        //   name: (module: webpack.Module, chunks: webpack.Chunk[]) => {
        //     return path.join(this.options.getRoot(chunks[0].name)!, 'common.js')
        //   },
        //   minChunks: 2,
        //   chunks: 'all'
        // }
        packages: (module: webpack.Module, chunkGraph: webpack.ChunkGraph) => {
          const chunks = module.getChunks()
          const packages = new Set<string>()
          const options: any[] = []
          chunks.forEach(chunk => {
            const result = this.options.getRoot(chunk.name)
            if (result) {
              packages.add(result)
            }
          })
          for (const lib of packages) {
            options.push({
              name: path.join(lib, 'common.js'),
              chunks: (chunk: { name: string }) => this.options.getRoot(chunk.name) === lib,
              minChunks: 2
            })
          }
          return options
        }
      }
    }).apply(compiler)
  }
}