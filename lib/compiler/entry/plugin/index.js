"use strict";
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
const webpack_1 = require("webpack");
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const manager_1 = __importDefault(require("../manager"));
const require_chunk_plugin_1 = __importDefault(require("./require-chunk-plugin"));
const split_package_plugin_1 = __importDefault(require("./split-package-plugin"));
const app_data_1 = __importDefault(require("./app-data"));
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
                    this.app.getEntries(content).forEach(({ root, path }) => {
                        const name = this.manager.addPage(path, root);
                        result[name] = {
                            import: [path]
                        };
                    });
                    this.manager.load(({ name, path }) => {
                        result[name] = {
                            import: [path]
                        };
                    });
                    return reslove(result);
                });
            });
        })).apply(compiler);
        compiler.hooks.compilation.tap(this.name, (compilation) => {
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
                    compilation.emitAsset('app.json', this.app.source);
                }
                this.manager.complete();
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
            name: 'runtime.js'
        }).apply(compiler);
        new split_package_plugin_1.default({
            getRoot: name => this.manager.getRoot(name)
        }).apply(compiler);
        new require_chunk_plugin_1.default().apply(compiler);
    }
}
exports.default = MPEntryPlugin;
