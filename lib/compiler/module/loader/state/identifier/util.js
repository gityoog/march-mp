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
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEventCall = exports.genPropCall = exports.fnName = exports.genExpression = exports.mergeMember = void 0;
var t = __importStar(require("@babel/types"));
function mergeMember(identifier, indexs) {
    var node = identifier;
    indexs.forEach(function (index) {
        node = t.memberExpression(node, t.identifier(index), true);
    });
    return node;
}
exports.mergeMember = mergeMember;
function genExpression(indexs) {
    var e_1, _a;
    var property = undefined;
    try {
        for (var indexs_1 = __values(indexs), indexs_1_1 = indexs_1.next(); !indexs_1_1.done; indexs_1_1 = indexs_1.next()) {
            var index = indexs_1_1.value;
            if (!property) {
                property = t.identifier(index);
            }
            else {
                property = t.binaryExpression('+', t.binaryExpression('+', property, t.stringLiteral('_')), t.identifier(index));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (indexs_1_1 && !indexs_1_1.done && (_a = indexs_1.return)) _a.call(indexs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return property;
}
exports.genExpression = genExpression;
exports.fnName = {
    prop: '_$p',
    event: '_$e'
};
function genPropCall(value, name, native) {
    return t.callExpression(t.identifier(exports.fnName.prop), [
        value,
        name
    ].concat(native ? t.booleanLiteral(true) : []));
}
exports.genPropCall = genPropCall;
function genEventCall(value, name) {
    return t.callExpression(t.identifier(exports.fnName.event), [
        value,
        name
    ]);
}
exports.genEventCall = genEventCall;
