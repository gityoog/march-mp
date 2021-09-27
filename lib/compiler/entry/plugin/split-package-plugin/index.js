"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = require("webpack");
var path_1 = require("path");
var SplitPackagePlugin = /** @class */ (function () {
    function SplitPackagePlugin(options) {
        this.options = options;
        this.name = 'SplitPackagePlugin';
    }
    SplitPackagePlugin.prototype.apply = function (compiler) {
        var _this = this;
        new webpack_1.default.optimize.SplitChunksPlugin({
            minSize: 0,
            minChunks: 999,
            maxAsyncRequests: Infinity,
            maxInitialRequests: Infinity,
            cacheGroups: {
                common: {
                    test: function (module, _a) {
                        var chunkGraph = _a.chunkGraph;
                        return chunkGraph.getModuleChunks(module).some(function (chunk) { return _this.options.getRoot(chunk.name) === undefined; });
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
                packages: function (module, chunkGraph) {
                    var e_1, _a;
                    var chunks = module.getChunks();
                    var packages = new Set();
                    var options = [];
                    chunks.forEach(function (chunk) {
                        var result = _this.options.getRoot(chunk.name);
                        if (result) {
                            packages.add(result);
                        }
                    });
                    var _loop_1 = function (lib) {
                        options.push({
                            name: path_1.default.join(lib, 'common.js'),
                            chunks: function (chunk) { return _this.options.getRoot(chunk.name) === lib; },
                            minChunks: 2
                        });
                    };
                    try {
                        for (var packages_1 = __values(packages), packages_1_1 = packages_1.next(); !packages_1_1.done; packages_1_1 = packages_1.next()) {
                            var lib = packages_1_1.value;
                            _loop_1(lib);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (packages_1_1 && !packages_1_1.done && (_a = packages_1.return)) _a.call(packages_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return options;
                }
            }
        }).apply(compiler);
    };
    return SplitPackagePlugin;
}());
exports.default = SplitPackagePlugin;
