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
Object.defineProperty(exports, "__esModule", { value: true });
const t = __importStar(require("@babel/types"));
class MapScope {
    constructor() {
        this.data = [];
        this.dict = {};
    }
    push(item, index, parent) {
        this.data.push([item, index, parent]);
        this.update();
    }
    enter(path, parent) {
        const arrowFn = path.get('arguments')[0];
        if (!arrowFn.isArrowFunctionExpression()) {
            throw path.buildCodeFrameError('Map only support ArrowFunctionExpression');
        }
        const params = arrowFn.node.params;
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
    }
    exit() {
        this.data.pop();
        this.update();
    }
    getIndex(id) {
        return this.dict[id];
    }
    update() {
        const dict = {};
        this.data.forEach(([item, index, parent]) => {
            dict[item] = dict[index] = [index].concat(parent);
        });
        this.dict = dict;
    }
    getScope(path) {
        var _a;
        const result = [];
        if (this.data.length > 0) {
            const indexs = new Set();
            path.traverse({
                Identifier: item => {
                    var _a;
                    const name = item.node.name;
                    if (t.isReferenced(item.node, item.parent)) {
                        if (item.scope.getBinding(name) === path.parentPath.scope.getBinding(name)) {
                            (_a = this.getIndex(name)) === null || _a === void 0 ? void 0 : _a.forEach(index => {
                                indexs.add(index);
                            });
                        }
                    }
                }
            });
            // traverse 不会遍历当前元素
            if (path.isIdentifier()) {
                (_a = this.getIndex(path.node.name)) === null || _a === void 0 ? void 0 : _a.forEach(index => {
                    indexs.add(index);
                });
            }
            result.push(...indexs);
            indexs.clear();
        }
        return result;
    }
    destroy() {
    }
}
exports.default = MapScope;
