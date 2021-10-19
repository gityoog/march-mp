"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const path_1 = __importDefault(require("path"));
const ensure_posix_path_1 = __importDefault(require("ensure-posix-path"));
class RequireChunkPlugin {
    constructor(options = {}) {
        this.name = 'RequireChunkPlugin';
        this.options = {
            calcPath: options.calcPath || ((entry, chunk) => {
                return (0, ensure_posix_path_1.default)(path_1.default.relative(path_1.default.dirname(entry.name), chunk.name));
            }),
            addPath: options.addPath || ((paths) => paths.map(path => `require("${path.replace(/\\/g, '\/')}");`).join('\n') + '\n')
        };
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(this.name, (compilation) => {
            webpack_1.default.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(this.name, (source, { chunk, chunkGraph }) => {
                // isEntry
                if (chunkGraph.getNumberOfEntryModules(chunk) > 0) {
                    const chunks = Array.from(chunk.getAllReferencedChunks()).filter(chunk_ => chunk_ !== chunk);
                    if (chunks.length > 0) {
                        return new webpack_1.default.sources.ConcatSource(this.options.addPath(chunks.map(c => this.options.calcPath(chunk, c))), source);
                    }
                }
                return source;
            });
        });
    }
}
exports.default = RequireChunkPlugin;
