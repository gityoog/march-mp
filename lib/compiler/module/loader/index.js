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
const data_1 = __importDefault(require("../data"));
const transform_1 = __importDefault(require("./transform"));
const fs_1 = __importDefault(require("fs"));
const state_1 = __importDefault(require("./state"));
function default_1(source) {
    const data = data_1.default.Init(this.resourcePath);
    const state = new state_1.default(this.resourcePath);
    const callback = this.async();
    (() => __awaiter(this, void 0, void 0, function* () {
        (0, transform_1.default)(source, state);
        data.setWXML(state.wxml);
        data.setJSON(state.json);
        for (const file of state.cssfile) {
            const { source, err } = yield new Promise((reslove) => {
                this.loadModule(file, (err, source) => {
                    reslove({
                        err,
                        source
                    });
                });
            });
            if (err) {
                this.emitError(err);
                continue;
            }
            if (source) {
                data.addWXSS(JSON.parse(source));
            }
        }
        for (const name in state.components) {
            const component = state.components[name];
            const { filename, err } = yield loadModule(this, component.path);
            if (err) {
                this.emitError(err);
                continue;
            }
            data.addChild(name, filename);
            if (/\.js$/.test(filename)) {
                // 原生组件 导入wxss wxml json wxs
                const componentData = data_1.default.Init(filename);
                const filepath = filename.replace(/\.js$/, '');
                ['wxss', 'wxml', 'json', 'wxs'].forEach(ext => {
                    const path = filepath + '.' + ext;
                    if (fs_1.default.existsSync(path)) {
                        componentData.setStatic(ext, fs_1.default.readFileSync(path).toString());
                        this.addDependency(path);
                    }
                });
            }
            else {
                state.setComponentNative(name);
            }
        }
        state.warning.forEach(warn => this.emitWarning(warn));
        const code = state.generate();
        state.destroy();
        return code;
    }))().then(source => {
        callback(null, source);
    }).catch((e) => {
        callback(e);
    });
}
exports.default = default_1;
function loadModule(loaderContext, request) {
    // this.loadModule 会引起递归检测 
    return new Promise((reslove) => {
        loaderContext.resolve(loaderContext.context, request, (err, path) => {
            if (err)
                return reslove({
                    filename: null,
                    module: null,
                    err
                });
            const filename = path;
            const compilation = loaderContext._compilation;
            compilation.buildQueue.increaseParallelism();
            compilation.addModuleChain(loaderContext.context, webpack_1.EntryPlugin.createDependency(filename, filename), (err, module) => {
                compilation.buildQueue.decreaseParallelism();
                if (err)
                    return reslove({
                        filename: null,
                        module: null,
                        err
                    });
                loaderContext.addDependency(filename);
                reslove({
                    filename,
                    module: module
                });
            });
        });
    });
}
