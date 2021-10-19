"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importStar(require("webpack"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const manager_1 = __importDefault(require("../manager"));
const require_chunk_plugin_1 = __importDefault(require("./require-chunk-plugin"));
const split_package_plugin_1 = __importDefault(require("./split-package-plugin"));
const app_data_1 = __importDefault(require("./app-data"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
class MPEntryPlugin {
    constructor(options = {}) {
        this.options = options;
        this.name = 'MPEntryPlugin';
        this.manager = new manager_1.default;
        this.app = new app_data_1.default;
    }
    apply(compiler) {
        const context = compiler.context;
        this.app.setContext(context);
        this.app.setIgnore(this.options.ignore);
        this.manager.setContext(context);
        new webpack_1.DynamicEntryPlugin(context, () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((reslove, reject) => {
                compiler.inputFileSystem.readFile(this.app.path, (err, content) => {
                    if (err)
                        return reject(err);
                    if (!content)
                        return reject('获取入口信息失败');
                    const result = {};
                    this.manager.loadOld(({ name, path }) => {
                        result[name] = {
                            import: [path]
                        };
                    });
                    this.app.getEntries(content).forEach(({ root, path, independent }) => {
                        const name = this.manager.addPage(path, root, independent);
                        result[name] = {
                            import: [path]
                        };
                    });
                    return reslove(result);
                });
            });
        })).apply(compiler);
        compiler.hooks.compilation.tap(this.name, (compilation) => {
            webpack_1.default.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderChunk.tap(this.name, (source, { chunk, chunkGraph }) => {
                for (const module of chunkGraph.getChunkEntryModulesIterable(chunk)) {
                    if (chunkGraph.getModuleChunks(module).length > 1) {
                        const root = this.manager.getRoot(chunk.name);
                        const moduleId = chunkGraph.getModuleId(module);
                        if (root) {
                            return new webpack_1.default.sources.RawSource((0, utils_1.repalceAll)(source.source().toString(), JSON.stringify(moduleId), JSON.stringify(moduleId + '!' + root)));
                        }
                    }
                }
                return source;
            });
            webpack_1.default.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderMain.tap(this.name, (source, renderContext) => {
                if (renderContext.chunk.hasRuntime()) {
                    const globalObject = compilation.outputOptions.globalObject;
                    return new webpack_1.default.sources.RawSource(source.source().toString()
                        .replace(`var __webpack_modules__ = `, `var __webpack_modules__ = ${globalObject}['__webpack_modules__'] = ${globalObject}['__webpack_modules__'] || `)
                        .replace(`var __webpack_module_cache__ = `, `var __webpack_module_cache__ = ${globalObject}['__webpack_module_cache__'] = ${globalObject}['__webpack_module_cache__'] || `));
                }
                return source;
            });
            compilation.fileDependencies.add(this.app.path);
            compilation.hooks.finishModules.tapPromise(this.name, () => __awaiter(this, void 0, void 0, function* () {
                this.manager.generate();
                for (const data of this.manager.data) {
                    if (this.manager.needLoad(data)) {
                        yield new Promise((resolve, reject) => {
                            compilation.addEntry(context, webpack_1.EntryPlugin.createDependency(data.path, data.name), data.name, (err) => {
                                if (err)
                                    return reject(err);
                                resolve();
                            });
                        });
                    }
                }
            }));
            compilation.hooks.beforeChunkAssets.tap(this.name, () => {
                this.manager.data.forEach(data => {
                    data.getFiles().forEach(({ file, source }) => {
                        compilation.emitAsset(file, source);
                    });
                });
                if (this.app.source) {
                    compilation.emitAsset(this.app.name, this.app.source);
                }
            });
            compilation.hooks.additionalAssets.tap(this.name, () => {
                this.manager.getNotUsed().forEach(name => {
                    compilation.deleteAsset(name);
                });
            });
        });
        // 复制根目录文件
        new copy_webpack_plugin_1.default({
            patterns: [{
                    from: './*',
                    globOptions: {
                        ignore: ['**/*.scss', '**/app.ts', '**/*.tsx', '**/*.js', '**/tsconfig.json', '**/Thumbs.db', '**/app.json']
                    }
                }]
        }).apply(compiler);
        new webpack_1.optimize.RuntimeChunkPlugin({
            name: ({ name }) => {
                const root = this.manager.getRoot(name);
                if (root && this.app.isIndependent(root)) {
                    return path_1.default.join(root, 'runtime.js');
                }
                return 'runtime.js';
            }
        }).apply(compiler);
        new split_package_plugin_1.default({
            getRoot: name => this.manager.getRoot(name),
            getRoots: () => this.app.getRoots(),
            isIndependent: name => {
                const root = this.manager.getRoot(name);
                if (root) {
                    return this.app.isIndependent(root);
                }
                return false;
            }
        }).apply(compiler);
        new require_chunk_plugin_1.default().apply(compiler);
    }
}
exports.default = MPEntryPlugin;
