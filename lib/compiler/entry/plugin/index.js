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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const manager_1 = __importDefault(require("../manager"));
const require_chunk_plugin_1 = __importDefault(require("./require-chunk-plugin"));
const split_package_plugin_1 = __importDefault(require("./split-package-plugin"));
const jsonName = 'app.json';
class MPEntryPlugin {
    constructor(options = {}) {
        this.options = options;
        this.name = 'MPEntryPlugin';
        this.manager = new manager_1.default;
    }
    ignore(page) {
        var _a;
        return (_a = this.options.ignore) === null || _a === void 0 ? void 0 : _a.some(item => {
            if (typeof item === 'string') {
                return page === item;
            }
            else {
                return item.test(page);
            }
        });
    }
    apply(compiler) {
        var _a, _b;
        const context = compiler.context;
        const appjson = path_1.default.resolve(compiler.context, jsonName);
        const appjsonData = JSON.parse(fs_1.default.readFileSync(appjson, 'utf8'));
        if (this.options.ignore && this.options.ignore.length > 0) {
            appjsonData.pages = (_a = appjsonData.pages) === null || _a === void 0 ? void 0 : _a.filter(page => !this.ignore(page));
            (_b = appjsonData.subpackages) === null || _b === void 0 ? void 0 : _b.forEach(({ root, pages }) => {
                pages = pages.filter(page => !this.ignore(root + '/' + page));
            });
        }
        this.manager.setContext(compiler.context);
        new webpack_1.DynamicEntryPlugin(compiler.context, () => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            const result = {};
            const entries = [];
            (_c = appjsonData.pages) === null || _c === void 0 ? void 0 : _c.forEach(item => {
                entries.push({
                    path: path_1.default.resolve(context, item + '.tsx')
                });
            });
            (_d = appjsonData.subpackages) === null || _d === void 0 ? void 0 : _d.forEach(({ root, pages }) => {
                pages.forEach(item => {
                    entries.push({
                        root,
                        path: path_1.default.resolve(context, root, item + '.tsx')
                    });
                });
            });
            entries.forEach(({ root, path }) => {
                const name = this.manager.addPage(path, root);
                result[name] = {
                    import: [path]
                };
            });
            return result;
        })).apply(compiler);
        compiler.hooks.compilation.tap(this.name, (compilation) => {
            compilation.fileDependencies.add(appjson);
            compilation.hooks.finishModules.tapPromise(this.name, () => __awaiter(this, void 0, void 0, function* () {
                this.manager.generate();
                for (const data of this.manager.data) {
                    yield new Promise((resolve, reject) => {
                        if (!data.isPage) {
                            compilation.addEntry(context, webpack_1.EntryPlugin.createDependency(data.path, data.name), data.name, (err) => {
                                if (err)
                                    return reject(err);
                                resolve();
                            });
                        }
                        else {
                            resolve();
                        }
                    });
                }
            }));
            compilation.hooks.beforeChunkAssets.tap(this.name, () => {
                this.manager.data.forEach(data => {
                    data.getFiles().forEach(({ file, source }) => {
                        compilation.emitAsset(file, source);
                    });
                });
                compilation.emitAsset('app.json', new webpack_1.default.sources.RawSource(JSON.stringify(appjsonData, null, 2)));
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
