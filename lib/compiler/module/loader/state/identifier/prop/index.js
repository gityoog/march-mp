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
var util_1 = require("../util");
var PropIdentifier = /** @class */ (function () {
    function PropIdentifier(_a) {
        var path = _a.path, scope = _a.scope, name = _a.name;
        this.native = false;
        this.name = name;
        this.path = path;
        this.scope = scope;
        this.value = path.node;
        this.path.replaceWith((0, util_1.mergeMember)(t.identifier(name), scope));
    }
    PropIdentifier.prototype.setNative = function () {
        this.native = true;
    };
    PropIdentifier.prototype.restore = function () {
        this.path.replaceWith((0, util_1.genPropCall)(this.value, this.scope.length > 0 ? t.arrayExpression(__spreadArray([t.stringLiteral(this.name)], __read(this.scope.map(function (key) { return t.identifier(key); })), false)) : t.stringLiteral(this.name), this.native));
        this.name = null;
        this.path = null;
        this.scope = null;
        this.value = null;
    };
    return PropIdentifier;
}());
exports.default = PropIdentifier;
