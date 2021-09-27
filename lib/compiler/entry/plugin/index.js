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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importStar(require("webpack"));
var copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var manager_1 = __importDefault(require("../manager"));
var require_chunk_plugin_1 = __importDefault(require("./require-chunk-plugin"));
var split_package_plugin_1 = __importDefault(require("./split-package-plugin"));
var jsonName = 'app.json';
var MPEntryPlugin = /** @class */ (function () {
    function MPEntryPlugin() {
        this.name = 'MPEntryPlugin';
        this.manager = new manager_1.default;
    }
    MPEntryPlugin.prototype.apply = function (compiler) {
        var _this = this;
        var context = compiler.context;
        var appjson = path_1.default.resolve(compiler.context, jsonName);
        var appjsonData = JSON.parse(fs_1.default.readFileSync(appjson, 'utf8'));
        this.manager.setContext(compiler.context);
        new webpack_1.DynamicEntryPlugin(compiler.context, function () { return __awaiter(_this, void 0, void 0, function () {
            var result, entries;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                result = {};
                entries = [];
                (_a = appjsonData.pages) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                    entries.push({
                        path: path_1.default.resolve(context, item + '.tsx')
                    });
                });
                (_b = appjsonData.subpackages) === null || _b === void 0 ? void 0 : _b.forEach(function (_a) {
                    var root = _a.root, pages = _a.pages;
                    pages.forEach(function (item) {
                        entries.push({
                            root: root,
                            path: path_1.default.resolve(context, root, item + '.tsx')
                        });
                    });
                });
                entries.forEach(function (_a) {
                    var root = _a.root, path = _a.path;
                    var name = _this.manager.addPage(path, root);
                    result[name] = {
                        import: [path]
                    };
                });
                return [2 /*return*/, result];
            });
        }); }).apply(compiler);
        compiler.hooks.compilation.tap(this.name, function (compilation) {
            compilation.fileDependencies.add(appjson);
            compilation.hooks.finishModules.tapPromise(_this.name, function () { return __awaiter(_this, void 0, void 0, function () {
                var _loop_1, _a, _b, data, e_1_1;
                var e_1, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.manager.generate();
                            _loop_1 = function (data) {
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                if (!data.isPage) {
                                                    compilation.addEntry(context, webpack_1.EntryPlugin.createDependency(data.path, data.name), data.name, function (err) {
                                                        if (err)
                                                            return reject(err);
                                                        resolve();
                                                    });
                                                }
                                                else {
                                                    resolve();
                                                }
                                            })];
                                        case 1:
                                            _e.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 6, 7, 8]);
                            _a = __values(this.manager.data), _b = _a.next();
                            _d.label = 2;
                        case 2:
                            if (!!_b.done) return [3 /*break*/, 5];
                            data = _b.value;
                            return [5 /*yield**/, _loop_1(data)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            _b = _a.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _d.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            }); });
            compilation.hooks.beforeChunkAssets.tap(_this.name, function () {
                _this.manager.data.forEach(function (data) {
                    data.getFiles().forEach(function (_a) {
                        var file = _a.file, source = _a.source;
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
            getRoot: function (name) { return _this.manager.getRoot(name); }
        }).apply(compiler);
        new require_chunk_plugin_1.default().apply(compiler);
    };
    return MPEntryPlugin;
}());
exports.default = MPEntryPlugin;
