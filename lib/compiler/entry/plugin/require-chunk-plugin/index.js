"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var path_1 = __importDefault(require("path"));
var ensure_posix_path_1 = __importDefault(require("ensure-posix-path"));
var RequireChunkPlugin = /** @class */ (function () {
    function RequireChunkPlugin(options) {
        if (options === void 0) { options = {}; }
        this.name = 'RequireChunkPlugin';
        this.options = {
            runtime: options.runtime || 'runtime.js',
            calcPath: options.calcPath || (function (entry, chunk) {
                return (0, ensure_posix_path_1.default)(path_1.default.relative(path_1.default.dirname(entry.name), chunk.name));
            }),
            addPath: options.addPath || (function (paths) { return paths.map(function (path) { return "require(\"" + path.replace(/\\/g, '\/') + "\");"; }).join('\n') + '\n'; })
        };
    }
    RequireChunkPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.compilation.tap(this.name, function (compilation) {
            webpack_1.default.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(_this.name, function (source, _a) {
                var chunk = _a.chunk, chunkGraph = _a.chunkGraph;
                var isEntry = function (chunk_) {
                    return chunkGraph.getNumberOfEntryModules(chunk_) > 0;
                };
                if (isEntry(chunk)) {
                    var chunks = Array.from(chunk.getAllReferencedChunks()).filter(function (chunk_) { return chunk_ !== chunk; });
                    if (chunks.length > 0) {
                        return new webpack_1.default.sources.ConcatSource(_this.options.addPath(chunks.map(function (c) { return _this.options.calcPath(chunk, c); })), source);
                    }
                }
                return source;
            });
        });
    };
    return RequireChunkPlugin;
}());
exports.default = RequireChunkPlugin;
