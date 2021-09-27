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
var webpack_1 = require("webpack");
var data_1 = __importDefault(require("../data"));
var transform_1 = __importDefault(require("./transform"));
var fs_1 = __importDefault(require("fs"));
var state_1 = __importDefault(require("./state"));
function default_1(source) {
    var _this = this;
    var data = data_1.default.Init(this.resourcePath);
    var state = new state_1.default(this.resourcePath);
    var callback = this.async();
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, file, _c, module_1, err, source_1, e_1_1, _loop_1, this_1, _d, _e, _i, name_1, code;
        var e_1, _f;
        var _this = this;
        var _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, transform_1.default)(source, state);
                    data.setWXML(state.wxml);
                    data.setJSON(state.json);
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 6, 7, 8]);
                    _a = __values(state.cssfile), _b = _a.next();
                    _h.label = 2;
                case 2:
                    if (!!_b.done) return [3 /*break*/, 5];
                    file = _b.value;
                    return [4 /*yield*/, loadModule(this, file)];
                case 3:
                    _c = _h.sent(), module_1 = _c.module, err = _c.err;
                    if (err) {
                        this.emitError(err);
                        return [3 /*break*/, 4];
                    }
                    source_1 = (_g = module_1.originalSource()) === null || _g === void 0 ? void 0 : _g.source().toString();
                    if (source_1) {
                        data.addWXSS(JSON.parse(source_1));
                    }
                    _h.label = 4;
                case 4:
                    _b = _a.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _h.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8:
                    _loop_1 = function (name_1) {
                        var component, _j, filename, err, componentData_1, filepath_1;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    component = state.components[name_1];
                                    return [4 /*yield*/, loadModule(this_1, component.path)];
                                case 1:
                                    _j = _k.sent(), filename = _j.filename, err = _j.err;
                                    if (err) {
                                        this_1.emitError(err);
                                        return [2 /*return*/, "continue"];
                                    }
                                    data.addChild(name_1, filename);
                                    if (/\.js$/.test(filename)) {
                                        componentData_1 = data_1.default.Init(filename);
                                        filepath_1 = filename.replace(/\.js$/, '');
                                        ['wxss', 'wxml', 'json', 'wxs'].forEach(function (ext) {
                                            var path = filepath_1 + '.' + ext;
                                            if (fs_1.default.existsSync(path)) {
                                                componentData_1.setStatic(ext, fs_1.default.readFileSync(path).toString());
                                                _this.addDependency(path);
                                            }
                                        });
                                    }
                                    else {
                                        state.setComponentNative(name_1);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    this_1 = this;
                    _d = [];
                    for (_e in state.components)
                        _d.push(_e);
                    _i = 0;
                    _h.label = 9;
                case 9:
                    if (!(_i < _d.length)) return [3 /*break*/, 12];
                    name_1 = _d[_i];
                    return [5 /*yield**/, _loop_1(name_1)];
                case 10:
                    _h.sent();
                    _h.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12:
                    code = state.generate();
                    state.destroy();
                    return [2 /*return*/, code];
            }
        });
    }); })().then(function (source) {
        callback(null, source);
    }).catch(function (e) {
        callback(e);
    });
}
exports.default = default_1;
function loadModule(loaderContext, request) {
    // this.loadModule 会引起递归检测 
    return new Promise(function (reslove) {
        loaderContext.resolve(loaderContext.context, request, function (err, path) {
            if (err)
                return reslove({
                    filename: null,
                    module: null,
                    err: err
                });
            var filename = path;
            var compilation = loaderContext._compilation;
            compilation.buildQueue.increaseParallelism();
            compilation.addModuleChain(loaderContext.context, webpack_1.EntryPlugin.createDependency(filename, filename), function (err, module) {
                compilation.buildQueue.decreaseParallelism();
                if (err)
                    return reslove({
                        filename: null,
                        module: null,
                        err: err
                    });
                loaderContext.addDependency(filename);
                reslove({
                    filename: filename,
                    module: module
                });
            });
        });
    });
}
