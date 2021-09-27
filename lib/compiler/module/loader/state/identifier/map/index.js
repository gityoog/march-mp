"use strict";
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
var t = require("@babel/types");
var util_1 = require("../util");
var MapIdentifier = /** @class */ (function () {
    function MapIdentifier(_a) {
        var path = _a.path, scope = _a.scope, name = _a.name;
        this.name = name;
        this.path = path;
        this.scope = scope;
        this.key = findMapKey(path);
        var node = (0, util_1.mergeMember)(t.identifier(name), scope);
        var calleeObject = path.get('callee.object');
        this.calleeObject = calleeObject.node;
        calleeObject.replaceWith(node);
    }
    MapIdentifier.prototype.restore = function () {
        var calleeObject = this.path.get('callee.object');
        calleeObject.replaceWith(this.calleeObject);
        var arrowFn = this.path.get('arguments')[0];
        if (arrowFn.isArrowFunctionExpression()) {
            var jsxElement = arrowFn.get('body');
            if (jsxElement.isJSXElement()) {
                jsxElement.replaceWith(t.sequenceExpression([jsxElement.node, this.key || t.nullLiteral()]));
            }
        }
        // _$p(a.map(item => [key|null, ...]), name: string|string[], deepDiff: true)
        this.path.replaceWith((0, util_1.genPropCall)(this.path.node, this.scope.length > 0 ? t.arrayExpression(__spreadArray([t.stringLiteral(this.name)], __read(this.scope.map(function (key) { return t.identifier(key); })), false)) : t.stringLiteral(this.name)));
        this.name = null;
        this.path = null;
        this.calleeObject = null;
        this.scope = null;
        this.key = null;
    };
    return MapIdentifier;
}());
exports.default = MapIdentifier;
function findMapKey(path) {
    var arrowFn = path.get('arguments')[0];
    if (arrowFn.isArrowFunctionExpression()) {
        var jsxElement = arrowFn.get('body');
        if (jsxElement.isJSXElement()) {
            var attr = jsxElement.get('openingElement').get('attributes').find(function (path) {
                return path.isJSXAttribute() && path.node.name.name === 'key';
            });
            var value = attr === null || attr === void 0 ? void 0 : attr.get('value');
            if (value === null || value === void 0 ? void 0 : value.isJSXExpressionContainer()) {
                var expression = value.node.expression;
                if (!t.isJSXEmptyExpression(expression)) {
                    value.replaceWith(t.stringLiteral("*this"));
                    return expression;
                }
            }
            else if (value === null || value === void 0 ? void 0 : value.isStringLiteral()) {
                var param = arrowFn.node.params[0] = (arrowFn.node.params[0] || path.scope.generateUidIdentifier('t'));
                var key = value.node.value;
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
