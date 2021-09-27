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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var t = __importStar(require("@babel/types"));
var MapScope = /** @class */ (function () {
    function MapScope() {
        this.data = [];
        this.dict = {};
    }
    MapScope.prototype.push = function (item, index, parent) {
        this.data.push([item, index, parent]);
        this.update();
    };
    MapScope.prototype.enter = function (path, parent) {
        var arrowFn = path.get('arguments')[0];
        if (!arrowFn.isArrowFunctionExpression()) {
            throw path.buildCodeFrameError('Map only support ArrowFunctionExpression');
        }
        var params = arrowFn.node.params;
        if (!params[0]) {
            params.push(path.scope.generateUidIdentifier('t'));
        }
        if (!params[1]) {
            params.push(path.scope.generateUidIdentifier('i'));
        }
        if (!t.isIdentifier(params[0]) || !t.isIdentifier(params[1])) {
            throw path.buildCodeFrameError('Map params only support Identifier');
        }
        this.push(params[0].name, params[1].name, parent);
    };
    MapScope.prototype.exit = function () {
        this.data.pop();
        this.update();
    };
    MapScope.prototype.getIndex = function (id) {
        return this.dict[id];
    };
    MapScope.prototype.update = function () {
        var dict = {};
        this.data.forEach(function (_a) {
            var _b = __read(_a, 3), item = _b[0], index = _b[1], parent = _b[2];
            dict[item] = dict[index] = [index].concat(parent);
        });
        this.dict = dict;
    };
    MapScope.prototype.getScope = function (path) {
        var _this = this;
        var _a;
        var result = [];
        if (this.data.length > 0) {
            var indexs_1 = new Set();
            path.traverse({
                Identifier: function (item) {
                    var _a;
                    var name = item.node.name;
                    if (t.isReferenced(item.node, item.parent)) {
                        if (item.scope.getBinding(name) === path.parentPath.scope.getBinding(name)) {
                            (_a = _this.getIndex(name)) === null || _a === void 0 ? void 0 : _a.forEach(function (index) {
                                indexs_1.add(index);
                            });
                        }
                    }
                }
            });
            // traverse 不会遍历当前元素
            if (path.isIdentifier()) {
                (_a = this.getIndex(path.node.name)) === null || _a === void 0 ? void 0 : _a.forEach(function (index) {
                    indexs_1.add(index);
                });
            }
            result.push.apply(result, __spreadArray([], __read(indexs_1), false));
            indexs_1.clear();
        }
        return result;
    };
    MapScope.prototype.destroy = function () {
    };
    return MapScope;
}());
exports.default = MapScope;
