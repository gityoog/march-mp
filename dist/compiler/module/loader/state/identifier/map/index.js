"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const util_1 = require("../util");
class MapIdentifier {
    constructor({ path, scope, name }) {
        this.name = name;
        this.path = path;
        this.scope = scope;
        this.key = findMapKey(path);
        const node = (0, util_1.mergeMember)(t.identifier(name), scope);
        const calleeObject = path.get('callee.object');
        this.calleeObject = calleeObject.node;
        calleeObject.replaceWith(node);
    }
    restore() {
        const calleeObject = this.path.get('callee.object');
        calleeObject.replaceWith(this.calleeObject);
        const arrowFn = this.path.get('arguments')[0];
        if (arrowFn.isArrowFunctionExpression()) {
            const jsxElement = arrowFn.get('body');
            if (jsxElement.isJSXElement()) {
                jsxElement.replaceWith(t.sequenceExpression([jsxElement.node, this.key || t.nullLiteral()]));
            }
        }
        // _$p(a.map(item => [key|null, ...]), name: string|string[], deepDiff: true)
        this.path.replaceWith((0, util_1.genPropCall)(this.path.node, this.scope.length > 0 ? t.arrayExpression([t.stringLiteral(this.name), ...this.scope.map(key => t.identifier(key))]) : t.stringLiteral(this.name)));
        this.name = null;
        this.path = null;
        this.calleeObject = null;
        this.scope = null;
        this.key = null;
    }
}
exports.default = MapIdentifier;
function findMapKey(path) {
    const arrowFn = path.get('arguments')[0];
    if (arrowFn.isArrowFunctionExpression()) {
        const jsxElement = arrowFn.get('body');
        if (jsxElement.isJSXElement()) {
            const attr = jsxElement.get('openingElement').get('attributes').find(path => {
                return path.isJSXAttribute() && path.node.name.name === 'key';
            });
            const value = attr === null || attr === void 0 ? void 0 : attr.get('value');
            if (value === null || value === void 0 ? void 0 : value.isJSXExpressionContainer()) {
                const expression = value.node.expression;
                if (!t.isJSXEmptyExpression(expression)) {
                    value.replaceWith(t.stringLiteral("*this"));
                    return expression;
                }
            }
            else if (value === null || value === void 0 ? void 0 : value.isStringLiteral()) {
                const param = arrowFn.node.params[0] = (arrowFn.node.params[0] || path.scope.generateUidIdentifier('t'));
                const key = value.node.value;
                if (key === '*this') {
                    return param;
                }
                else {
                    value.replaceWith(t.stringLiteral("*this"));
                    return t.memberExpression(param, t.identifier(key), false);
                }
            }
        }
    }
}
