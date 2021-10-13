"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const path_1 = __importDefault(require("path"));
class SplitPackagePlugin {
    constructor(options) {
        this.options = options;
        this.name = 'SplitPackagePlugin';
        this.packages = [];
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(this.name, (compilation) => {
            compilation.hooks.afterOptimizeModules.tap(this.name, () => {
                this.packages = this.options.getRoots().map(root => {
                    return {
                        name: path_1.default.join(root, 'common.js'),
                        chunks: (chunk) => this.options.getRoot(chunk.name) === root,
                        minChunks: 2,
                        priority: 5
                    };
                });
            });
        });
        new webpack_1.default.optimize.SplitChunksPlugin({
            maxAsyncRequests: Infinity,
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                common: {
                    test: (module, { chunkGraph }) => {
                        return chunkGraph.getModuleChunks(module).some(chunk => this.options.getRoot(chunk.name) === undefined);
                    },
                    name: 'common.js',
                    minChunks: 2,
                    chunks: chunk => !this.options.isIndependent(chunk.name),
                    priority: 10
                },
                packages: () => {
                    return this.packages;
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
        }).apply(compiler);
    }
}
exports.default = SplitPackagePlugin;
